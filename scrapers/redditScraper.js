const axios = require('axios');
const qs = require('qs');

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_SECRET = process.env.REDDIT_SECRET;
const REDDIT_USERNAME = process.env.REDDIT_USERNAME;
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD;
const REDDIT_USER_AGENT = 'Glowbot Skincare by Then-Bodybuilder4539';
async function getRedditAccessToken() {
  const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      qs.stringify({
        grant_type: 'password',
        username: REDDIT_USERNAME,
        password: REDDIT_PASSWORD,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': REDDIT_USER_AGENT,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('⚠️ Reddit Token Error:', error.response?.data || error.message);
    return null;
  }
}

async function getRedditTrending() {
  const token = await getRedditAccessToken();
  if (!token) {
    throw new Error('Failed to obtain Reddit access token');
  }

  try {
    const response = await axios.get(
      'https://oauth.reddit.com/r/SkincareAddiction/hot?limit=10',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': REDDIT_USER_AGENT,
        },
      }
    );

    const posts = response.data.data.children;

    return posts
      .filter(p => p.data && !p.data.stickied)
      .map(p => ({
        title: p.data.title,
        link: `https://reddit.com${p.data.permalink}`,
        caption: 'Trending Reddit skincare discussion',
      }));
  } catch (err) {
    console.error('⚠️ Reddit fetch error:', err.response?.data || err.message);
    return [];
  }
}

module.exports = { getRedditTrending };