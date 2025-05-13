// 📁 gpt/generateProsAndCons.js
module.exports = async function generateProsAndCons(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a balanced skincare reviewer who helps people make informed decisions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a pros and cons breakdown for "${product}". Keep it under 30 words.`),
    gptPrompt(`List 3 pros and 3 cons of "${product}". Be concise with 100 words or less, but insightful, and maintain a balanced tone.`),
    gptPrompt(`In 1 sentence, wrap up the pros and cons and recommend who should try "${product}". Keep it under 20 words.`)
  ]);

  return {
    type: "prosAndCons",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
