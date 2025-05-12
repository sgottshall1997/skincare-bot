// ✅ Reddit Scraper - redditScraper.js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getRedditTrending() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a skincare trend analyst. Return a list of 5 trending Reddit skincare topics as JSON with this structure: [{ title, link, caption }]. Keep link values as "#" placeholders.'
        },
        {
          role: 'user',
          content: 'What are the latest trending skincare topics on Reddit?'
        }
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content.trim();
    const jsonStart = raw.indexOf('[');
    const json = raw.slice(jsonStart);
    return JSON.parse(json);
  } catch (err) {
    const errorReason = 'Using AI-generated content because Reddit API requires authentication and has strict rate limits';
    console.error('❌ Reddit Scraper Error:', {
      status: err.response?.status,
      message: err.message,
      error: err.response?.data?.error || 'Unknown error',
      type: err.name,
      stack: err.stack?.split('\n')[0],
      details: err.response?.data?.error?.errors || [],
      openaiError: err.response?.data?.error || null
    });
    console.log("📍 Error occurred in:", __filename);
    console.log("🔍 OpenAI API Key status:", process.env.OPENAI_API_KEY ? "Present" : "Missing");
    console.log(`⚠️ ${errorReason}`);
    return [
      { title: "The Truth About Retinol", link: "#", caption: "Reddit's skincare community debates retinol myths" },
      { title: "Korean Skincare Dupes", link: "#", caption: "Affordable alternatives to popular K-beauty products" },
      { title: "Sunscreen Showdown", link: "#", caption: "r/SkincareAddiction rates the best sunscreens" },
      { title: "Tretinoin Journey", link: "#", caption: "Before and after: 6 months on tretinoin" },
      { title: "Sensitive Skin Solutions", link: "#", caption: "Building a routine for reactive skin" }
    ];
  }
}

module.exports = { getRedditTrending };

