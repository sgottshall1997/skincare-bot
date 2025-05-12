// 📁 gpt/generateBeginnerKit.js
module.exports = async function generateBeginnerKit(openai) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare educator introducing beginners to affordable, effective routines." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a beginner skincare kit. Keep it under 30 words.`),
    gptPrompt(`List exactly 5 essential skincare products that belong in a beginner’s kit. Use this format:\n\n1. Gentle Cleanser – Removes dirt and oil without drying.`),
    gptPrompt(`In 1 sentence, encourage beginners to stick with their routine and stay consistent. Keep it under 20 words.`)
  ]);

  return {
    type: "beginnerKit",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
