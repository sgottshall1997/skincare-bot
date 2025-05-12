// 📁 gpt/generateTikTokBreakdown.js
module.exports = async function generateTikTokBreakdown(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare creator breaking down trending TikTok content with insights and attitude." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce why "${product}" is trending on TikTok. Keep it under 30 words.`),
    gptPrompt(`Break down why "${product}" is blowing up on TikTok in 125 words or less. Mention key creators, viral claims, and results people are seeing.`),
    gptPrompt(`In 1 sentence, encourage viewers to try "${product}" and share their thoughts. Keep it under 20 words.`)
  ]);

  return {
    type: "tiktokBreakdown",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
