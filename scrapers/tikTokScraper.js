const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

const hashtags = [
  'skincare',
  'skincareroutine',
  'acnetips',
  'dryskin',
  'glowup',
  'skincaretips',
  'skincareproducts',
];

function getRandomHashtag() {
  const randomIndex = Math.floor(Math.random() * hashtags.length);
  return hashtags[randomIndex];
}

async function getTikTokTrending() {
  if (!SCRAPER_API_KEY) {
    console.error('⚠️ SCRAPER_API_KEY not found in environment variables');
    return [];
  }

  const hashtag = getRandomHashtag();
  // Try TikTok discovery instead of hashtag for more reliable scraping
  const targetURL = `https://www.tiktok.com/discover/${hashtag}`;
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetURL)}&render=true`;


  try {
    console.log(`🔍 Attempting to scrape TikTok discovery page: /discover/${hashtag}`);

    const maxRetries = 3;
    const timeout = 60000;
    let attempt = 0;
    let response;

    while (attempt < maxRetries) {
      try {
        response = await axios.get(scraperUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
          },
          timeout: timeout
        });

        if (response.data) {
          // Log raw HTML preview for debugging
          console.log('📃 TikTok raw HTML preview:\n', response.data.slice(0, 500));
          break;
        }
      } catch (err) {
        attempt++;
        if (attempt === maxRetries) throw err;
        console.log(`⏳ Retry attempt ${attempt} for hashtag #${hashtag}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!response?.data) {
      throw new Error('Empty response from scraper API');
    }

    const $ = cheerio.load(response.data);
    const posts = [];

    const selectors = [
      'div[data-e2e="search-video-item"]',
      'div[data-e2e="video-item"]',
      '.video-feed-item',
      'div[data-e2e="browse-video-item"]' // added for discover
    ];

    for (const selector of selectors) {
      $(selector).each((i, el) => {
        const title =
          $(el).find('a').attr('title') ||
          $(el).find('[data-e2e="video-desc"]').text() ||
          `Trending TikTok on #${hashtag}`;

        const link = $(el).find('a').attr('href');

        if (link) {
          posts.push({
            title: title.trim(),
            link: link.startsWith('http') ? link : `https://www.tiktok.com${link}`,
            caption: `Trending TikTok skincare video from #${hashtag}`
          });
        }
      });

      if (posts.length > 0) break;
    }

    if (posts.length === 0) {
      console.warn('⚠️ No TikTok posts found with any selector');
      return [];
    }

    console.log(`✅ Successfully scraped ${posts.length} TikTok posts`);
    return posts.slice(0, 6);

  } catch (err) {
    console.error('❌ TikTok scraper error:', {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      hashtag,
      timestamp: new Date().toISOString()
    });
    return [];
  }
}

module.exports = { getTikTokTrending };
