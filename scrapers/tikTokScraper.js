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
  const hashtag = getRandomHashtag();
  const targetURL = `https://www.tiktok.com/tag/${hashtag}`;
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetURL)}`;

  try {
    const response = await axios.get(scraperUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const posts = [];

    $('div[data-e2e="search-video-item"]').each((i, el) => {
      const title = $(el).find('a').attr('title') || `Trending TikTok on #${hashtag}`;
      const link = 'https://www.tiktok.com' + $(el).find('a').attr('href');

      posts.push({
        title,
        link,
        caption: `Trending TikTok skincare video from #${hashtag}`,
      });
    });

    return posts.slice(0, 6);
  } catch (err) {
    console.error('⚠️ TikTok scraper error:', err.message);
    return [];
  }
}

module.exports = { getTikTokTrending };
