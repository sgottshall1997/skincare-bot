const fetch = require('node-fetch');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_RESULTS = 10;

async function getYouTubeTrending() {
  try {
    const query = 'skincare routine OR review OR unboxing OR product demo';

    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&q=${encodeURIComponent(query)}&order=date&maxResults=${MAX_RESULTS}`;

    const response = await fetch(url);
    const data = await response.json();

    const videos = (data.items || [])
      .filter(item =>
        item?.snippet?.title &&
        /skin|beauty|routine|glow|acne|hydration/i.test(item.snippet.title)
      )
      .map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        publishedAt: item.snippet.publishedAt
      }));

    return videos;
  } catch (error) {
    console.error('❌ YouTube Scraper Error:', error.message);
    return [];
  }
}

module.exports = { getYouTubeTrending };
