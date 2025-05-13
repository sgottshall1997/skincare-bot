// 📁 gpt/generateRoutineExample.js
module.exports = async function generateRoutineExample(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare educator building sample daily routines with product integrations." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a simple skincare routine with "${product}". Keep it under 30 words.`),
    gptPrompt(`Create a basic 4-step skincare routine in under 125 words (AM or PM) that includes "${product}". For each step, include the step name and a short note, e.g.,\n\n1. Cleanser – Gently removes dirt and oil.`),
    gptPrompt(`In 1 sentence, encourage consistency in the routine and remind viewers of long-term benefits. Keep it under 20 words.`)
  ]);

  return {
    type: "routineExample",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
