// 📁 gpt/generateProductComparison.js
module.exports = async function generateProductComparison(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare expert who explains product comparisons in a clear, helpful, and confident tone." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a product comparison for "${product}". Keep it under 20 words and make it intriguing.`),
    gptPrompt(`Compare "${product}" to a popular alternative in 100 words. Highlight differences in ingredients, performance, and price. Recommend who might prefer one over the other.`),
    gptPrompt(`In 1 sentence, give a takeaway that helps the viewer decide if "${product}" is worth switching to. Keep it under 20 words.`)
  ]);

  return {
    type: "productComparison",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
