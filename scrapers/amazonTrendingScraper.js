// scrapers/amazonTrendingScraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

async function getAmazonTrending() {
  const targetURL = 'https://www.amazon.com/Best-Sellers-Beauty/zgbs/beauty';
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetURL)}`;

  try {
    const res = await axios.get(scraperUrl);
    const $ = cheerio.load(res.data);

    const products = [];

    $('div.zg-grid-general-faceout').each((i, el) => {
      if (i < 5) {
        const title =
          $(el).find('.p13n-sc-truncate-desktop-type2').text().trim() ||
          $(el).find('.p13n-sc-truncated').text().trim();
        const link = 'https://www.amazon.com' + $(el).find('a.a-link-normal').attr('href');
        products.push({ title, link });
      }
    });

    return products;
  } catch (err) {
    console.error('❌ Error scraping Amazon trending:', err.message);
    return [
      { title: 'Fallback Product 1', link: 'https://www.amazon.com' },
      { title: 'Fallback Product 2', link: 'https://www.amazon.com' }
    ];
  }
}

module.exports = getAmazonTrending;
