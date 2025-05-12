
const googleTrends = require('google-trends-api');

async function getGoogleTrends() {
  try {
    // Get trending skincare searches from the last 24 hours
    const results = await googleTrends.dailyTrends({
      geo: 'US',
      category: 'b' // Beauty & Fitness category
    });

    const trends = JSON.parse(results).default.trendingSearchesDays[0].trendingSearches
      .filter(trend => {
        const query = trend.title.query.toLowerCase();
        return query.includes('skin') || 
               query.includes('beauty') || 
               query.includes('face') ||
               query.includes('cream') ||
               query.includes('serum');
      })
      .slice(0, 5)
      .map(trend => ({
        title: trend.title.query,
        link: trend.shareUrl,
        caption: trend.articles[0]?.snippet || trend.formattedTraffic
      }));

    // If no skincare trends found, fallback to real-time trends
    if (trends.length === 0) {
      const realTimeTrends = await googleTrends.realTimeTrends({
        geo: 'US',
        category: 'b',
        property: 'youtube'
      });
      
      return JSON.parse(realTimeTrends).storySummaries.trendingStories
        .slice(0, 5)
        .map(story => ({
          title: story.articles[0].articleTitle,
          link: story.articles[0].url,
          caption: story.articles[0].snippet
        }));
    }

    return trends;
  } catch (err) {
    // Check for specific error types
    let errorReason = '';
    if (err.message.includes('429')) {
      errorReason = 'Rate limit exceeded - too many requests to Google Trends API';
    } else if (err.message.includes('<!doctype')) {
      errorReason = 'IP temporarily blocked by Google Trends';
    } else {
      errorReason = 'Connection or parsing error';
    }
    
    console.error('❌ Google Trends Error:', {
      reason: errorReason,
      message: err.message,
      type: err.name,
      stack: err.stack?.split('\n')[0]
    });
    console.log("📍 Error occurred in:", __filename);
    console.log(`⚠️ Using AI-generated trends because: ${errorReason}`);
    
    // Fallback data in case of API failure
    return [
      { title: "Best Winter Moisturizers", link: "#", caption: "Rising searches for winter skincare" },
      { title: "Vitamin C Serums", link: "#", caption: "Trending skincare ingredients" },
      { title: "Korean Beauty Routine", link: "#", caption: "Growing interest in K-beauty" },
      { title: "Natural Face Masks", link: "#", caption: "DIY skincare trending" },
      { title: "Retinol Products", link: "#", caption: "Anti-aging searches increase" }
    ];
  }
}

module.exports = { getGoogleTrends };
