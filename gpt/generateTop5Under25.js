// 📁 gpt/generateTop5Under25.js
module.exports = async function generateTop5Under25(openai) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a savvy skincare content creator helping people find effective products on a budget." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a list of skincare products under $25. Keep it under 30 words.`),
    gptPrompt(`List 5 great skincare products that cost less than $25. For each, include the product name and a short benefit using this format:\n\n1. The Ordinary Niacinamide 10% – Helps reduce oil and visibly smooth skin.`),
    gptPrompt(`In 1 sentence, motivate readers to buy affordable products. Keep it under 20 words.`)
  ]);

  return {
    type: "top5Under25",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
