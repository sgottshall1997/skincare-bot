
// 📁 gpt/generateTrendingProducts.js
module.exports = async function generateTrendingProducts(openai) {
  const prompt = `Give me a list of 5 skincare products that are currently trending on TikTok or Amazon. 
Only return the product names, numbered 1 through 5. No extra text.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a skincare market analyst tracking trending beauty products." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  const text = response.choices[0].message.content.trim();
  const products = text
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  return products;
};
