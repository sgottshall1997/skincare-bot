// 📁 gpt/generateFullOriginal.js
module.exports = async function generateFullOriginal(openai, product, tone = "engaging") {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare content expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });
    return response.choices[0].message.content.trim();
  }

  const [
    intro,
    productDescription,
    demoScript,
    problemSolution,
    personalReview,
    socialCaptions,
    hashtagSets,
    trendingHashtags,
    outro
  ] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, write a hook-style intro for "${product}" in a ${tone} tone. Keep it under 30 words.`),
    gptPrompt(`Write a short 100 word and helpful product description for "${product}" in an ${tone} tone.`),
    gptPrompt(`Create a 2-3 sentence skincare demo script for "${product}" that feels casual and confident.`),
    gptPrompt(`Describe a common skincare problem and how "${product}" solves it. Keep it under 4 sentences.`),
    gptPrompt(`Write a 100 word personal-sounding review of "${product}" by someone who used it daily for 2 weeks.`),
    gptPrompt(`Give me 3 social media captions for a post about "${product}". Include 1-2 emojis in each.`),
    gptPrompt(`Give me 3 sets of hashtags for skincare posts. Each set should include 5 hashtags relevant to "${product}".`),
    gptPrompt(`Give me 5 trending skincare hashtags for 2024.`),
    gptPrompt(`In 1 sentence, write a confident outro that encourages people to try "${product}". Keep it under 20 words.`)

  ]);

  return {
    type: "original",
    content: "Full content bundle",
    intro,
    productDescription,
    demoScript,
    problemSolution,
    personalReview,
    socialCaptions,
    hashtagSets,
    trendingHashtags,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};