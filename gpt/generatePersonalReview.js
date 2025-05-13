// 📁 gpt/generatePersonalReview.js
module.exports = async function generatePersonalReview(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare content creator writing authentic and helpful product reviews." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce your review for "${product}". Keep it under 20 words.`),
    gptPrompt(`Write a detailed, authentic-sounding 100 word or less personal review of "${product}". Include how long it was used, what results were seen, and how it felt during use.`),
    gptPrompt(`In 1 sentence, conclude your review and recommend who would benefit from using "${product}". Keep it under 20 words.`)
  ]);

  return {
    type: "personalReview",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
