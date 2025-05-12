// index.js (patch: fixed list templates like 'Top 5 for Dry Skin')
const { fetch } = require('undici');
const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const staticTrendingProducts = [
  "CeraVe Hydrating Cleanser",
  "The Ordinary Niacinamide Serum",
  "COSRX Snail Mucin",
  "Glow Recipe Watermelon Toner",
  "La Roche-Posay Toleriane Moisturizer"
];

const templates = {
  drySkinList: () => `List the top 5 skincare products for dry skin. Format exactly like this:

1. CeraVe Moisturizing Cream – Deeply hydrating and packed with ceramides.
2. The Ordinary Hyaluronic Acid – Boosts hydration with a lightweight feel.
3. La Roche-Posay Toleriane – Soothes sensitive, dry skin with minimal ingredients.
4. Eucerin Advanced Repair – Rich cream that locks in moisture.
5. Neutrogena Hydro Boost – Gel-based and perfect for layering.

Use this format. Keep it concise and readable aloud in a video. Do not skip any numbers or change the structure.`,
  top5Under25: () => `List 5 great skincare products under $25. Include brand and benefit. Use bullet points. Keep it helpful and clear.`,
  beginnerKit: () => `Create a 3-product skincare starter kit for beginners. Briefly explain each item and its purpose.`,
  routineExample: (product) => `Write a full AM and PM skincare routine featuring "${product}". Include 3-4 steps per routine and explain why each matters. Target 120–150 words.`,
  comparison: (product1, product2 = "a popular alternative") => `Compare "${product1}" and "${product2}" for oily skin. Include pros, cons, and ideal users. Aim for 4+ sentences.`,
  influencerCaption: (product) => `Write a catchy influencer-style caption for "${product}". Use slang, emojis, and keep it under 2 sentences.`,
  prosCons: (product) => `Give 3 pros and 3 cons for "${product}". Use bullet points. Be punchy and clear.`,
  whySwitched: (product) => `Explain why someone switched to "${product}" and what changed for them. Make it personal. 4–6 sentences.`,
  drugstoreDupes: (product) => `Suggest 2–3 affordable drugstore dupes for "${product}". Mention what makes them similar.`,
  tiktokBreakdown: (product) => `Break down why "${product}" is trending on TikTok. Include what influencers say and reactions. Aim for 100–120 words.`,
  trendAwareVideoHook: (product) => `Write a viral TikTok-style hook for "${product}". Make it engaging and under 15 words.`,
  redditBreakdown: (product) => `Summarize what people are saying about "${product}" on Reddit. Use 3 main takeaways.`,
  youtubeBreakdown: (product) => `Summarize a popular YouTube creator’s review of "${product}". Mention tone, outcome, and results.`,
  smartHashtagMix: (product) => `Generate 3 sets of hashtags for "${product}" combining niche, trending, and evergreen tags. Use list format.`
};

const getRandomTemplateKey = () => {
  const keys = Object.keys(templates);
  return keys[Math.floor(Math.random() * keys.length)];
};

const generateIntro = (templateType, product, isStandalone) => {
  const productPart = isStandalone ? '' : ` about "${product}"`;
  return `Write a natural 1-sentence introduction for a short video using the "${templateType}" content type${productPart}. Keep it casual and engaging.`;
};

const generateOutro = (templateType, product, isStandalone) => {
  const productPart = isStandalone ? '' : ` about "${product}"`;
  return `Write a natural 1-sentence conclusion for a short video using the "${templateType}" content type${productPart}. Encourage comments.`;
};

async function callOpenAIWithRetry(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await openai.chat.completions.create(prompt);
      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      if (err.response?.status >= 500 || err.response?.status === 429) {
        await new Promise(r => setTimeout(r, attempt * 1000));
        continue;
      }
      throw err;
    }
  }
}

const fetchYouTubeTrends = async () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=skincare%20routine&type=video&order=viewCount&key=${apiKey}`);
  const data = await response.json();
  return data.items?.map(item => item.snippet?.title).filter(Boolean) || [];
};

const fetchRedditTrends = async () => [
  "Why everyone’s talking about snail mucin again",
  "Is CeraVe still worth it in 2025?",
  "Top dupes people swear by"
];

const fetchTikTokTrends = async () => [
  "Skincare girlies are obsessed with this",
  "I tried it for 7 days and here's what happened",
  "Overhyped or worth it?"
];

app.post('/generate', async (req, res) => {
  try {
    const { product, affiliate, tone, templateType } = req.body;
    console.log('📦 Request:', req.body);

    const [yt, reddit, tiktok] = await Promise.all([
      fetchYouTubeTrends(), fetchRedditTrends(), fetchTikTokTrends()
    ]);

    const trendIntro = `\nCurrent YouTube trends:\n- ${yt.join('\n- ')}\nReddit threads:\n- ${reddit.join('\n- ')}\nTikTok captions:\n- ${tiktok.join('\n- ')}`;

    const generateSection = async (prompt, systemMessage) => {
      try {
        const response = await callOpenAIWithRetry({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
          ]
        });
        return response.choices?.[0]?.message?.content?.trim().replace(/\*/g, '').replace(/^(\d+\.\s*)/gm, '').trim() || null;
      } catch (error) {
        console.error(`Section generation failed: ${error.message}`);
        return null;
      }
    };

    const isStandaloneTemplate = ['drySkinList', 'top5Under25', 'beginnerKit'].includes(templateType);
const promptText = templates[templateType]
  ? (isStandaloneTemplate ? templates[templateType]() : templates[templateType](product))
  : templates[getRandomTemplateKey()](product);

    if (templateType && templateType !== 'original') {
      const fullPrompt = `${trendIntro}\n\n${promptText}\n\nMake sure your response is helpful, clear, and not too short. Format with line breaks. Minimum 100 words if applicable.`;

      const content = await generateSection(fullPrompt, isStandaloneTemplate
  ? `You are a viral social content writer. Your job is to create short, punchy skincare content that can be spoken aloud. Follow list format strictly. Use natural but clear language.`
  : `You are a skincare content creator writing for social media. Answer fully. Be useful, engaging, and easy to read.`);

      const intro = await generateSection(generateIntro(templateType, product, isStandaloneTemplate), `You are a skincare influencer. Start the video naturally.`);
      const outro = await generateSection(generateOutro(templateType, product, isStandaloneTemplate), `You are a skincare influencer. End with a call to comment.`);

      return res.json({
        product,
        tone: tone || 'default',
        intro,
        generatedContent: content,
        productDescription: null,
        demoScript: null,
        problemSolution: null,
        personalReview: null,
        socialCaptions: null,
        hashtagSets: null,
        trendingHashtags: null,
        outro,
        templateType,
        timestamp: new Date().toISOString(),
        errors: {}
      });
    }

    // fallback: original full-output section
    const sections = await Promise.all([
      generateSection(`Write a single-sentence product description for "${product}".`, `You are a copywriter. Be concise and under 25 words.`),
      generateSection(`Write a 1-2 step demo script for "${product}".`, `You are a skincare expert. Max 30 words.`),
      generateSection(`Write a concise problem/solution statement for "${product}".`, `You are a skincare expert. Max 35 words.`),
      generateSection(`Write a short personal review of "${product}".`, `You are a skincare enthusiast. Max 30 words.`),
      generateSection(`Write 3 short social media captions for "${product}".`, `You are a trendy skincare influencer. Format as a list with emojis.`),
      generateSection(`Create 3 concise sets of skincare-related hashtags for "${product}".`, `You are a social media expert.`),
      generateSection(`List 5 trending skincare hashtags.`, `You are a trend analyst.`),
      generateSection(generateIntro(templateType, product), `You are a skincare influencer. Start the video naturally.`),
      generateSection(generateOutro(templateType, product), `You are a skincare influencer. End with a call to comment.`)
    ]);

    const [productDesc, demoScript, problemSolution, review, captions, hashtags, trendingTags, intro, outro] = sections;

    const responsePayload = {
      product,
      tone: tone || 'default',
      intro,
      productDescription: productDesc,
      demoScript,
      problemSolution,
      personalReview: review,
      socialCaptions: captions,
      hashtagSets: hashtags,
      trendingHashtags: trendingTags,
      outro,
      templateType,
      timestamp: new Date().toISOString(),
      errors: {}
    };

    await fetch("https://hook.us2.make.com/beup8lq9w0suq7s4x338b291j1l6e4ua", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responsePayload)
    });

    res.json(responsePayload);
  } catch (err) {
    console.error("❌ Generation error:", err);
    res.status(500).json({
      product: req.body.product,
      tone: req.body.tone || 'default',
      generatedContent: null,
      timestamp: new Date().toISOString(),
      errors: {
        global: err.message || "Failed to generate content"
      }
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
