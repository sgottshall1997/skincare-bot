// 🔁 Hybrid Reddit Scraper with ScraperAPI + OpenAI fallback
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

async function tryScraperAPI() {
  const targetURL = 'https://www.reddit.com/r/SkincareAddiction/top/?t=day';
  const scraperUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetURL)}`;

  try {
    const res = await axios.get(scraperUrl);
    const $ = cheerio.load(res.data);
    const posts = [];

    $('h3').each((i, el) => {
      if (i < 5) {
        const title = $(el).text().trim();
        if (title) posts.push({ title, link: '#', caption: 'Trending Reddit skincare discussion' });
      }
    });

    if (posts.length) return posts;
    throw new Error('No h3 tags found');
  } catch (err) {
    console.warn('⚠️ ScraperAPI Reddit failed:', err.message);
    return null;
  }
}

async function tryOpenAIFallback() {
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
      temperature: 0.7
    });

    const raw = completion.choices[0].message.content.trim();
    const jsonStart = raw.indexOf('[');
    const json = raw.slice(jsonStart);
    return JSON.parse(json);
  } catch (err) {
    console.warn('⚠️ OpenAI fallback failed:', err.message);
    return null;
  }
}

async function getRedditTrending() {
  const fromScraper = await tryScraperAPI();
  if (fromScraper) return fromScraper;

  const fromAI = await tryOpenAIFallback();
  if (fromAI) return fromAI;

  // Final fallback
  return [
    { title: "The Truth About Retinol", link: "#", caption: "Reddit's skincare community debates retinol myths" },
    { title: "Korean Skincare Dupes", link: "#", caption: "Affordable alternatives to popular K-beauty products" },
    { title: "Sunscreen Showdown", link: "#", caption: "r/SkincareAddiction rates the best sunscreens" },
    { title: "Tretinoin Journey", link: "#", caption: "Before and after: 6 months on tretinoin" },
    { title: "Sensitive Skin Solutions", link: "#", caption: "Building a routine for reactive skin" }
  ];
}

module.exports = { getRedditTrending };
