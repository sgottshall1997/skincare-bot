// 📁 gpt/generateDrugstoreDupe.js
module.exports = async function generateDrugstoreDupe(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare expert revealing affordable alternatives to luxury products." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a great drugstore dupe for a high-end product. Keep it under 30 words.`),
    gptPrompt(`Describe how "${product}" is a great drugstore dupe for a more expensive product in 110 words or less. Compare the key ingredients, performance, and results.`),
    gptPrompt(`In 1 sentence, encourage readers to try "${product}" and save money. Keep it under 20 words.`)
  ]);

  return {
    type: "drugstoreDupe",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
