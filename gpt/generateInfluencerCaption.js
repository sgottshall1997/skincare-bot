
// 📁 gpt/generateInfluencerCaption.js
module.exports = async function generateInfluencerCaption(openai, product, tone = "influencer") {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare influencer who writes captions that convert and engage." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce an influencer caption for "${product}". Keep it under 30 words.`),
    gptPrompt(`Write a short, punchy influencer-style caption for "${product}" in a ${tone} tone. Include 1-2 emojis and a light call to action.`),
    gptPrompt(`In 1 sentence, write a short outro that encourages followers to try "${product}". Keep it under 20 words.`)
  ]);

  return {
    type: "influencerCaption",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
