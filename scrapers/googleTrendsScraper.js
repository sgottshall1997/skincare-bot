const fetch = require('node-fetch');

async function getGoogleTrends() {
  try {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https://trends.google.com/trends/trendingsearches/daily/rss?geo=US`;
    const response = await fetch(url);
    const json = await response.json();

    const items = json.items || [];

    return items.slice(0, 5).map(item => ({
      title: item.title,
      pubDate: item.pubDate,
      link: item.link,
    }));
  } catch (error) {
    console.error('❌ Google Trends Scraper Error:', error.message);
    return [
      { title: 'Fallback Trend 1', pubDate: '', link: '' },
      { title: 'Fallback Trend 2', pubDate: '', link: '' },
    ];
  }
}

module.exports = getGoogleTrends;
