# 🌟 GlowBot — AI-Powered Skincare Affiliate Content Engine

GlowBot is a full-stack, AI-driven content generation tool that turns **trending skincare products** into **viral-style scripts, captions, and hashtags** for affiliate marketing on platforms like TikTok, Instagram, and Threads.

Built on **Node.js + OpenAI + Replit + Make.com**, GlowBot scrapes trends, generates content using GPT-4, and auto-publishes across social channels using automation tools.

---

## ⚙️ Tech Stack

- **Backend**: Node.js (Express)
- **Frontend**: HTML, JS, TailwindCSS
- **AI**: OpenAI API (GPT-3.5/4)
- **Scrapers**: TikTok, Reddit, Instagram, Amazon, YouTube
- **Automation**: Make.com webhook integration
- **Deployment**: Replit

---

## 🧠 Core Features

- 🔥 Scrapes trending skincare products and discussions
- 💡 Generates GPT-powered content using tone + template selectors:
  - Demo scripts
  - Problem/solution videos
  - Review scripts
  - Influencer-style captions
  - Hashtag sets
- 💸 Automatically embeds Amazon affiliate links
- 🚀 Supports scheduled automation via cron and Make.com webhook
- 🧪 Fallback logic and scraper health diagnostics

---

## 🗂 Project Structure

```bash
├── index.js                # Main Express server
├── scrapers/               # Scraper files (TikTok, Reddit, etc.)
├── prompts/                # Dynamic prompt generation logic
├── utils/                  # Auto-pipeline + helper functions
├── public/                 # Frontend HTML, JS, and styling
├── secrets (Replit)        # Secure API keys
🔐 Important Notes

This repo is currently private

API keys (OpenAI, Make, ScraperAPI, etc.) are managed using Replit Secrets

Make.com scenario is triggered automatically via /auto-post route

▶️ How It Works (Dev Flow)
User selects tone + content type

Scraper fetches top trending products

Prompt system crafts a GPT request

OpenAI returns scripts, captions, hashtags

Content is displayed on frontend + sent to Make.com for posting

📅 Automation Pipeline
This flow is triggered automatically every 6–12 hours (via cron):

Run all scrapers

Select top trending items

Generate GPT content

Format response payload

Send to Make.com webhook for cross-platform posting

🛠 Dev Setup Instructions
Clone the repo (if granted access)

Add your secrets to Replit:

OPENAI_API_KEY

SCRAPER_API_KEY

REDDIT_API_KEY (if applicable)

MAKE_WEBHOOK_URL

Install dependencies:

bash
Copy
Edit
npm install
Run the app:

bash
Copy
Edit
node index.js
Access the frontend at https://<your-repl-name>.<your-username>.repl.co

🚧 TODO / In Progress
 Refactor scraper logic to be fully modular

 Improve fallback + error handling

 Finalize /admin route for job logs + scraper health

 Add caching layer to avoid duplicate GPT outputs

🤝 Licensing / NDA
This project contains proprietary logic tied to monetization strategy.
Do not fork, clone, or reuse outside of contract.

📬 Questions?
DM or email me — happy to walk you through the structure or assign onboarding tasks if you're jumping in as a contributor.

yaml
Copy
Edit

---

Want me to generate a matching **Loom walkthrough script** next so you can narrate the key parts to a potent
