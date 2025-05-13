const express = require('express');
const OpenAI = require('openai');
const path = require('path');

// Import content generation modules
const generateContent = require('./gpt/generateDrySkinList');
const generateInfluencerCaption = require('./gpt/generateInfluencerCaption');
const generateProductComparison = require('./gpt/generateProductComparison');
const generateRoutineExample = require('./gpt/generateRoutineExample');
const generateProsAndCons = require('./gpt/generateProsAndCons');
const generateTop5Under25 = require('./gpt/generateTop5Under25');
const generateWhyISwitched = require('./gpt/generateWhyISwitched');
const generateBeginnerKit = require('./gpt/generateBeginnerKit');
const generateDrugstoreDupe = require('./gpt/generateDrugstoreDupe');
const generateTikTokBreakdown = require('./gpt/generateTikTokBreakdown');
const generateSurpriseMe = require('./gpt/generateSurpriseMe');
const generateDemoScript = require('./gpt/generateDemoScript');
const generatePersonalReview = require('./gpt/generatePersonalReview');
const generateTrendingProducts = require('./gpt/generateTrendingProducts');

// Import Instagram and Twitter Scrapers
const { getTikTokTrending } = require('./scrapers/tikTokScraper');
const { getRedditTrending } = require('./scrapers/redditScraper');
const { getInstagramTrending } = require('./scrapers/instagramScraper');
const getGoogleTrends = require('./scrapers/googleTrendsScraper');


const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("OpenAI API Status:", process.env.OPENAI_API_KEY ? "✅ API Key Present" : "❌ Missing API Key");

const { getYouTubeTrending } = require('./scrapers/youtubeScraper');

app.get('/youtube-trending', async (req, res) => {
  const results = await getYouTubeTrending();
  res.json({ videos: results });
});

// Route to handle dynamic trending products from TikTok, Reddit, Instagram, and Twitter
app.get('/dynamic-trending', async (req, res) => {
  try {
    // Get trending content from all platforms
    const tiktokTrends = await getTikTokTrending();
    const redditTrends = await getRedditTrending();
    const instagramTrends = await getInstagramTrending();

    // Only use Instagram trends (products)
    const trendingData = instagramTrends.map(item => ({ platform: 'Instagram', ...item }));

    // Send back combined trending data
    res.json({ products: trendingData });
  } catch (err) {
    console.warn('Error fetching trending data:', err);
    res.json({ products: [] });  // Fallback to empty array if error occurs
  }
});

// Route to generate content
app.post('/generate', async (req, res) => {
  try {
    const { product, templateType, tone = "engaging" } = req.body;
    let result;

    switch (templateType) {
      case 'original':
      const generateOriginal = require('./gpt/generateOriginal (Full Content Output)');
      result = await generateOriginal(openai, product, tone);
      break;
      case 'drySkinList':
        result = await generateContent(openai);
        break;
      case 'influencerCaption':
        result = await generateInfluencerCaption(openai, product);
        break;
      case 'productComparison':
        result = await generateProductComparison(openai, product);
        break;
      case 'routineExample':
        result = await generateRoutineExample(openai, product);
        break;
      case 'prosAndCons':
        result = await generateProsAndCons(openai, product);
        break;
      case 'top5Under25':
        result = await generateTop5Under25(openai);
        break;
      case 'whyISwitched':
        result = await generateWhyISwitched(openai, product);
        break;
      case 'beginnerKit':
        result = await generateBeginnerKit(openai);
        break;
      case 'drugstoreDupe':
        result = await generateDrugstoreDupe(openai, product);
        break;
      case 'tiktokBreakdown':
        result = await generateTikTokBreakdown(openai, product);
        break;
      case 'surpriseMe':
        result = await generateSurpriseMe(openai, product);
        break;
      case 'demoScript':
        result = await generateDemoScript(openai, product);
        break;
      case 'personalReview':
        result = await generatePersonalReview(openai, product);
        break;
      default:
        return res.status(400).json({ error: 'Invalid template type' });
    }

    res.json({ result });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});



app.get('/trend-digest', async (req, res) => {
  try {
    const [tiktok, reddit, instagram, youtube, google] = await Promise.all([
      getTikTokTrending(),
      getRedditTrending(),
      getInstagramTrending(),
      getYouTubeTrending(),
      getGoogleTrends()
    ]);


    const combinedTrends = [...tiktok, ...reddit, ...instagram, ...youtube, ...google]
    .map(item => `- ${item.title || item.caption || ''}`)
    .slice(0, 15) // increase to fit extra trends
    .join('\n');

    const prompt = `
You are an AI trained to generate content ideas for skincare creators based on social media trends.

Here are recent trending topics:
${combinedTrends}

Please return the following as a JSON object with three fields:

{
  "viralHooks": ["idea 1", "idea 2", "idea 3"],
  "videoScript": ["line 1", "line 2", "line 3"], 
  "creatorInsight": "short final insight"
}

1. Generate 3 separate Viral Hook Ideas for TikTok or YouTube Shorts based on current skincare trends.
2. Create a short 150-word video script outline an AI could read as a voiceover.
3. Provide a final takeaway or insight for creators.

Respond with only the raw JSON object.`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();
    const jsonStart = raw.indexOf('{');
    const json = raw.slice(jsonStart);
    const parsed = JSON.parse(json);

    res.json(parsed);
  } catch (err) {
    console.error("Trend digest error:", err);
    res.json({
      viralHooks: [
        "💡 3 Skincare Mistakes You're Still Making",
        "Why This $12 Serum is Outselling Big Brands",
        "Glow Up in 30 Seconds a Day"
      ],
      videoScript: [
        "Today, we're fixing 3 common skincare mistakes — fast.",
        "From product layering to SPF fails, here's what you're missing.",
        "And wait till you see the glow from this budget serum."
      ],
      creatorInsight: "Trend-forward content works, but credibility wins. Pair viral hooks with helpful insights to grow faster."
    });
  }
});


// Scraper health check endpoint
app.get('/scraper-health', async (req, res) => {
  const statuses = {};

  // Check TikTok
  try {
    const tiktokData = await getTikTokTrending();
    statuses.tiktok = tiktokData && tiktokData.length > 0 ? '✅ AI Generated' : '⚠️ No Data';
  } catch (err) {
    console.error('TikTok health check error:', err);
    statuses.tiktok = '❌ Error';
  }

  // Check Instagram
  try {
    const instaData = await getInstagramTrending();
    statuses.instagram = instaData && instaData.length > 0 ? '✅ AI Generated' : '⚠️ No Data';
  } catch (err) {
    console.error('Instagram health check error:', err);
    statuses.instagram = '❌ Error';
  }

  // Check Reddit
  try {
    const redditData = await getRedditTrending();
    statuses.reddit = redditData && redditData.length > 0 ? '✅ AI Generated' : '⚠️ No Data';
  } catch (err) {
    console.error('Reddit health check error:', err);
    statuses.reddit = '❌ Error';
  }

  // Check Google Trends
  try {
    const getGoogleTrends = require('./scrapers/googleTrendsScraper');
    const googleData = await getGoogleTrends();
    statuses.google = googleData && googleData.length > 0 ? '✅ AI Generated' : '⚠️ No Data';
  } catch (err) {
    console.error('Google Trends health check error:', err);
    statuses.google = '❌ Error';
  }

  // Check YouTube with caching
  try {
    if (!global.youtubeHealthCache || Date.now() - global.youtubeHealthLastCheck > 5 * 60 * 1000) {
      const { getYouTubeTrending } = require('./scrapers/youtubeScraper');
      const youtubeData = await getYouTubeTrending();
      global.youtubeHealthCache = youtubeData && youtubeData.length > 0 ? 
        '✅ Active' : 
        '⚠️ API Error - Check YouTube API Key';
      global.youtubeHealthLastCheck = Date.now();
    }
    statuses.youtube = global.youtubeHealthCache;
  } catch (err) {
    console.error('YouTube health check error:', err);
    statuses.youtube = '❌ Error';
  }

  res.json(statuses);
});


// Start server
const PORT = process.env.PORT || 3000;


app.listen(PORT, '0.0.0.0', () => {
  const used = process.memoryUsage();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📊 Memory Usage:', {
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
    rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
  });
});

const promptFactory = require('./utils/promptFactory'); // Add near your other imports

// Route to handle batch generation of trending content
app.post('/generate-all', async (req, res) => {
  try {
    const tone = req.body.tone || '';
    const [tiktok, reddit, instagram] = await Promise.all([
      getTikTokTrending(),
      getRedditTrending(),
      getInstagramTrending(),
    ]);

    const trends = [...tiktok, ...reddit, ...instagram];
    const prompts = trends.map(trend => promptFactory(trend, tone));

    const results = [];

    for (const p of prompts) {
      const response = await fetch(`http://localhost:${PORT}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: p.product,
          templateType: p.templateType,
          tone: p.tone,
        }),
      });

      const result = await response.json();
      results.push({ trend: p.product, result });
    }

    res.json({ results });
  } catch (err) {
    console.error('❌ Batch generation failed:', err);
    res.status(500).json({ error: 'Batch generation failed' });
  }
});

console.log('✅ Server fully initialized');