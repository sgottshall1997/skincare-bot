// ✅ TikTok Scraper with GPT-generated trends via OpenAI API
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getTikTokTrending() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a skincare trend analyst. Return a list of 5 trending TikTok skincare topics as JSON with this structure: [{ title, link, caption }]. Keep link values as "#" placeholders.'
        },
        {
          role: 'user',
          content: 'Give me the latest trending skincare topics on TikTok.'
        }
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content.trim();
    const jsonStart = raw.indexOf('[');
    const json = raw.slice(jsonStart);
    return JSON.parse(json);
  } catch (err) {
    const errorReason = 'Using AI-generated content because TikTok API requires business account and has strict usage policies';
    console.error('❌ TikTok Scraper Error:', {
      timestamp: new Date().toISOString(),
      endpoint: 'GPT-4 TikTok Trends',
      requestStatus: err.status || 'unknown',
      quotaExceeded: err.message.includes('quota'),
      message: err.message,
      type: err.name,
      stack: err.stack?.split('\n')[0],
      openaiError: err.response?.data?.error || null
    });
    console.log("📍 Error occurred in:", __filename);
    console.log(`⚠️ ${errorReason}`);
    return [
      { title: "Slugging Hack", link: "#", caption: "Petroleum jelly overnight – TikTok’s viral skin barrier trick" },
      { title: "Glass Skin Routine", link: "#", caption: "5-step method to get glowy, poreless skin" },
      { title: "SPF Contour", link: "#", caption: "Using sunscreen to contour? Viral or busted?" },
      { title: "Retinol Sandwiching", link: "#", caption: "Moisturizer → Retinol → Moisturizer = Less irritation" },
      { title: "Ice Rolling", link: "#", caption: "Why everyone is rubbing frozen tubes on their face" }
    ];
  }
}

module.exports = { getTikTokTrending };