// ✅ YouTube Scraper using YouTube Data API v3
const axios = require('axios');

async function getYouTubeTrending() {
  console.log("📺 YouTube Scraper: Initializing...");
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const searchQuery = "skincare OR beauty routine";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;

    try {
      if (!API_KEY) {
        console.error("YouTube API key is missing");
        return [];
      }
      console.log("Attempting YouTube API call with key:", API_KEY.substring(0, 4) + "..." + API_KEY.substring(API_KEY.length - 4));
      const res = await axios.get(url);

      if (!res.data.items || !Array.isArray(res.data.items)) {
        console.error("Invalid YouTube API response format:", res.data);
        return [];
      }

      const videoData = res.data.items.map(item => ({
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        videoId: item.id.videoId,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

      return videoData;
    } catch (err) {
      console.error("❌ YouTube API Error:", {
        status: err.response?.status,
        message: err.message,
        error: err.response?.data?.error || 'Unknown error',
        quotaExceeded: err.response?.data?.error?.errors?.some(e => e.reason === 'quotaExceeded'),
        details: err.response?.data?.error?.errors || []
      });
      console.log("📍 Error occurred in:", __filename);
      console.log("🔍 API Key status:", API_KEY ? "Present" : "Missing");
      return [];
    }
  } catch (error) {
    console.error("❌❌❌ Top-Level YouTube Scraper Error:", error);
    return [];
  }
}

module.exports = { getYouTubeTrending };