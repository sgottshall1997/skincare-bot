const fetch = require('node-fetch');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCnkp4xDOwqqJD7sSM3xdUiQ'; // You can replace with your target channel ID
const MAX_RESULTS = 10;

async function getYouTubeTrending() {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;

    const response = await fetch(url);
    const data = await response.json();

    const videos = data.items
      .filter(item => item.id.kind === 'youtube#video')
      .map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        publishedAt: item.snippet.publishedAt
      }));

    return videos;
  } catch (error) {
    console.error('❌ YouTube Scraper Error:', error.message);
    return []; // Prevent crash by falling back to an empty array
  }
}

module.exports = { getYouTubeTrending };
