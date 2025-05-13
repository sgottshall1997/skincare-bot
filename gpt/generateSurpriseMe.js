// 📁 gpt/generateSurpriseMe.js
module.exports = async function generateSurpriseMe(openai, product) {
  async function gptPrompt(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative skincare copywriter known for surprising and delighting the audience." },
        { role: "user", content: prompt }
      ],
      temperature: 0.95
    });
    return response.choices[0].message.content.trim();
  }

  const [intro, content, outro] = await Promise.all([
    gptPrompt(`Write a playful, mysterious 30 words intro that teases a surprise piece of content about "${product}".`),
    gptPrompt(`Generate a fun and unexpected 100 word or less piece of skincare content about "${product}". It could be a weird tip, a story, or a bold claim — surprise the reader in a positive way.`),
    gptPrompt(`End with a quirky or clever 20 word outro that makes the viewer smile or want to share the post.`)
  ]);

  return {
    type: "surpriseMe",
    intro,
    content,
    outro,
    watermark: "generated-by-glowbot-v1"
  };
};
