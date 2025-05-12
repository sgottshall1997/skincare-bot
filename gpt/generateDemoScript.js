// 📁 gpt/generateDemoScript.js
module.exports = async function generateDemoScript(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative, engaging skincare content writer focused on UGC scripts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, write a punchy intro for a demo video featuring "${product}". Keep it under 30 words.`),
    gptPrompt(`Write a short 150 word demo script for "${product}". It should walk the viewer through how to use it and what it feels like, in a confident and casual tone.`),
    gptPrompt(`In 1 sentence, write a confident outro that encourages viewers to try "${product}". Keep it under 20 words.`)

  ]);

  return {
    type: "demoScript",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
