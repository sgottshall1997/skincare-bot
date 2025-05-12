// 📁 gpt/generateWhyISwitched.js
module.exports = async function generateWhyISwitched(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a skincare storyteller writing persuasive switch-style content." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`In 1–2 short sentences, introduce a story about switching to "${product}". Keep it under 30 words.`),
    gptPrompt(`Write a clear 150 word explanation of why the person switched to "${product}". Describe the differences they noticed, the improvements it made, and how it felt.`),
    gptPrompt(`In 1 sentence, recommend others try "${product}" and explain why. Keep it under 20 words.`)
  ]);

  return {
    type: "whyISwitched",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
