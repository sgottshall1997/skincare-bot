// 📁 gpt/generateDrySkinList.js
module.exports = async function generateDrySkinList(openai) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare expert known for recommending top-tier product picks for specific skin concerns." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a list of the top skincare products for dry skin. Keep it under 30 words.`),
    gptPrompt(`List the top 5 skincare products for dry skin. For each, include the name and a short benefit in this format: 
    1. CeraVe Moisturizing Cream – Deeply hydrating and packed with ceramides.
    Ensure you provide exactly 5 products.`),
    gptPrompt(`In 1 sentence, encourage readers to try a product and maintain consistency. Keep it under 20 words.`)
  ]);

  return {
    type: "drySkinList",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
