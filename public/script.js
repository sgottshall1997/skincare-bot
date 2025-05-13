const trendingContainer = document.getElementById('trending-products');
const trendDigestBox = document.getElementById('trend-digest-box');

// Call loadTrendingProducts when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadTrendingProducts();
  loadTrendDigest();
  updateScraperHealth(); // Call once on page load
});

console.log('🔥 Fetching from /dynamic-trending...');
function loadTrendingProducts() {
  trendingContainer.innerHTML = `
    <div class="bg-white p-4 rounded-lg shadow-sm w-full">
      <div class="animate-pulse">
        <p class="text-lg">⏳ Loading trending products...</p>
        <p class="text-sm text-base-content/70">This may take a few seconds</p>
      </div>
    </div>`;

  fetch('/dynamic-trending')
    .then(res => res.json())
    .then(data => {
      console.log('🧪 Trending data:', data.products);
      trendingContainer.innerHTML = '';

      (data.products || []).forEach(product => {
        let title;

        // Handle string format and object format
        if (typeof product === 'string') {
          title = product;
        } else if (typeof product === 'object') {
          title = product.title || product.caption || product.name || product.product || null;
        }

        if (!title) {
          console.warn('⚠️ Skipped invalid product:', product);
          return;
        }

        const element = document.createElement('button');
        element.className = 'px-4 py-2 rounded-full bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors text-sm whitespace-nowrap m-1';

        element.onclick = () => {
          document.getElementById('product-input').value = title;
          window.scrollTo({ top: document.getElementById('product-form').offsetTop, behavior: 'smooth' });
        };

        element.textContent = title;
        trendingContainer.appendChild(element);
      });

      loadTrendDigest();
    })
    .catch(err => {
      console.error('❌ Failed to load trending products:', err.message || err);
      trendingContainer.innerHTML = '<div class="alert alert-error">Failed to load trending products</div>';
    });
}

async function updateScraperHealth() {
  const healthContainer = document.getElementById('scraper-health');
  if (!healthContainer) return;

  try {
    const res = await fetch('/scraper-health');
    const statuses = await res.json();

    // Log only on first load
    if (!window.hasLoggedScraperHealth) {
      console.log('Scraper Health Status:', statuses);
      window.hasLoggedScraperHealth = true;
    }

    healthContainer.innerHTML = Object.entries(statuses)
      .map(([scraper, status]) => `
        <div class="flex items-center gap-2 p-2">
          <span class="font-medium">${scraper}:</span>
          <span>${status}</span>
        </div>
      `).join('');
  } catch (err) {
    console.error('❌ Failed to load scraper health:', err);
    healthContainer.innerHTML = '<div class="alert alert-error">Failed to load scraper health</div>';
  }
}

// Corrected scraper health updater
function updateScraperHealth() {
  fetch('/scraper-health')
    .then(res => res.json())
    .then(data => {
      console.log('Scraper Health Status:', data);
      const container = document.getElementById('scraper-health');
      if (container) {
        container.innerHTML = `
          <div class="mt-4 text-left text-sm leading-6">
            <strong class="block mb-1">🧠 Scraper Health</strong>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li>tiktok: ${data.tiktok || 'N/A'}</li>
              <li>instagram: ${data.instagram || 'N/A'}</li>
              <li>reddit: ${data.reddit || 'N/A'}</li>
              <li>google: ${data.google || 'N/A'}</li>
              <li>youtube: ${data.youtube || 'N/A'}</li>
              <li>amazon: ${data.amazon || 'N/A'}</li>
            </ul>
          </div>
        `;
      }
    })
    .catch(err => {
      console.error('❌ Failed to load scraper health:', err);
    });
}

// Start checking scraper health
updateScraperHealth();

async function loadTrendDigest() {
  if (!trendDigestBox) return;
  trendDigestBox.innerHTML = "Loading AI Trend Digest...";

  fetch('/trend-digest')
    .then(res => res.json())
    .then(data => {
      if (!data.viralHooks || !data.videoScript || !data.creatorInsight) {
        trendDigestBox.innerHTML = '<p class="text-gray-500">No trend digest available.</p>';
        return;
      }

      trendDigestBox.innerHTML = `
        <div class="space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-bold text-rose-700 mb-2">🎯 Viral Hook Ideas</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
              ${data.viralHooks.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-bold text-rose-700 mb-2">📝 Video Script Outline</h3>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
              ${data.videoScript.map(line => `<li>${line}</li>`).join('')}
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-bold text-rose-700 mb-2">💡 Creator Insight</h3>
            <p class="text-gray-700">${data.creatorInsight}</p>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      console.error('Trend Digest Error:', err);
      trendDigestBox.innerHTML = "❌ Failed to load AI Trend Digest. Check console for details.";
    });
}


const form = document.getElementById('product-form');
const resultsContainer = document.getElementById('results-container');
const resultsDiv = document.getElementById('results');
const productInput = document.getElementById('product-input');

// Character Counter
const updateCharCount = () => {
  const count = productInput.value.length;
  const maxLength = 100;
  productInput.parentElement.querySelector('.char-count').innerHTML = `${count}/${maxLength} characters`;
};
const charCounter = document.createElement('span');
charCounter.className = 'char-count text-sm text-base-content/70 mt-1';
productInput.parentElement.appendChild(charCounter);
updateCharCount();
productInput.addEventListener('input', updateCharCount);

// Keyboard Shortcut: Ctrl+Enter or Cmd+Enter
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (!form.querySelector('button[type="submit"]').disabled) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});

// Submission Handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, select');

  submitBtn.disabled = true;
  inputs.forEach(input => input.disabled = true);
  submitBtn.innerHTML = '<span class="loading loading-spinner"></span> Generating...';

  resultsDiv.innerHTML = `
    <div class="animate-pulse">
      <p class="text-lg">⏳ Crafting your content...</p>
      <p class="text-sm text-base-content/70">This may take a few seconds</p>
    </div>
  `;
  resultsContainer.style.display = 'block';
  resultsContainer.scrollIntoView({ behavior: 'smooth' });

  const product = document.getElementById('product-input').value;
  const affiliate = document.getElementById('affiliate-input').value;
  const tone = document.getElementById('tone-select').value;
  const templateSelect = document.getElementById('template-select');
  let templateType = templateSelect.value;

  const templateMap = {
    "comparison": "productComparison",
    "prosCons": "prosAndCons",
    "random": "surpriseMe",
    "whySwitched": "whyISwitched",
    "drugstoreDupes": "drugstoreDupe"
  };
  if (templateMap[templateType]) {
    templateType = templateMap[templateType];
  }

  try {
    const res = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, affiliate, tone, templateType }),
    });

    const data = await res.json();
    if (!res.ok || !data.result || !data.result.content) {
      const errorMsg = data.error || 'Invalid response from AI';
      throw new Error(errorMsg);
    }

    showToast('success', 'Content generated successfully!');
    displayResults(data);
  } catch (err) {
    console.error('❌ Generation error:', err);
    showToast('error', 'Something went wrong: ' + err.message);
    resultsDiv.innerHTML = `<div class="alert alert-error">❌ Error: ${err.message}</div>`;
  } finally {
    submitBtn.disabled = false;
    inputs.forEach(input => input.disabled = false);
    submitBtn.innerHTML = 'Generate Content';
  }
});

// ⏱️ Helper function to estimate video duration
function estimateVideoDuration(text) {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 2.5); // 2.5 words/sec
}

// 🔧 Patch displayResults to include estimated time
function displayResults(data, { append = false } = {}) {
  const resultsDiv = document.getElementById('results');
  const wrapper = document.createElement('div');
  wrapper.id = "content-wrapper";
  wrapper.className = "space-y-6";

  let totalText = '';

  if (data.result?.type === "original") {
    const sections = [
      { id: 'intro', title: '✨ Introduction', content: data.result.intro },
      { id: 'desc', title: '🧴 Product Description', content: data.result.productDescription },
      { id: 'demo', title: '🎥 Demo Script', content: data.result.demoScript },
      { id: 'problem', title: '❓ Problem/Solution', content: data.result.problemSolution },
      { id: 'review', title: '🗣️ Personal Review', content: data.result.personalReview },
      { id: 'captions', title: '💬 Social Captions', content: data.result.socialCaptions },
      { id: 'hashtags', title: '🏷️ Hashtag Sets', content: data.result.hashtagSets },
      { id: 'trending', title: '📈 Trending Skincare Hashtags', content: data.result.trendingHashtags },
      { id: 'outro', title: '💡 Conclusion', content: data.result.outro }
    ];

    sections.forEach(({ id, title, content }) => {
      if (content) {
        totalText += content + ' ';
        const div = document.createElement('div');
        div.className = 'bg-base-100 rounded-lg p-4 border';
        div.innerHTML = `
          <h3 class="font-bold mb-2">${title}</h3>
          <div id="${id}"><pre class="whitespace-pre-wrap">${content}</pre></div>
          <div class="flex justify-end mt-2">
            <button class="copy-btn tooltip" data-tip="Copy section" onclick="copyToClipboard('${id}')">
              📋 Copy Section
            </button>
          </div>
        `;
        wrapper.appendChild(div);
      }
    });
  } else {
    const sections = [
      { id: 'intro', title: '✨ Introduction', content: data.result.intro },
      { id: 'content', title: '📝 Content', content: data.result.content },
      { id: 'outro', title: '💡 Conclusion', content: data.result.outro }
    ];

    sections.forEach(({ id, title, content }) => {
      if (content) {
        totalText += content + ' ';
        const div = document.createElement('div');
        div.className = 'bg-base-100 rounded-lg p-4 border';
        div.innerHTML = `
          <h3 class="font-bold mb-2">${title}</h3>
          <div id="${id}"><pre class="whitespace-pre-wrap">${content}</pre></div>
          <div class="flex justify-end mt-2">
            <button class="copy-btn tooltip" data-tip="Copy section" onclick="copyToClipboard('${id}')">
              📋 Copy Section
            </button>
          </div>
        `;
        wrapper.appendChild(div);
      }
    });
  }

  const estimatedTime = estimateVideoDuration(totalText);
  const timeDiv = document.createElement('p');
  timeDiv.className = 'text-center text-sm text-gray-500 italic mt-2';
  timeDiv.textContent = `🎬 Estimated Video Length: ${estimatedTime} seconds`;
  wrapper.appendChild(timeDiv);

  wrapper.innerHTML += `
    <div class="flex justify-center mt-6">
      <button class="btn btn-primary" onclick="copyAll()">
        📋 Copy All Content
      </button>
    </div>
  `;

  if (!append) resultsDiv.innerHTML = '';
  resultsDiv.appendChild(wrapper);
  document.getElementById('results-container').style.display = 'block';
}


function copyToClipboard(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert(`✅ Copied section: ${id}`);
  });
}

function copyAll() {
  const preTags = document.querySelectorAll('#results pre');
  let allText = '';

  preTags.forEach(pre => {
    allText += pre.innerText.trim() + '\n\n';
  });

  navigator.clipboard.writeText(allText.trim()).then(() => {
    showToast('success', 'Copied all content!');
  });
}

function showToast(type, message) {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} fixed bottom-4 right-4 max-w-sm fade-in z-50`;
  toast.innerHTML = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// 🔁 Generate content for all trending products in batch (with progress bar)
document.getElementById('generate-all-btn').addEventListener('click', async () => {
  const tone = document.getElementById('tone-select').value;
  showToast('info', 'Batch generation started...');

  // Show progress UI
  const progressWrapper = document.getElementById('batch-progress');
  const progressBar = document.getElementById('progress-bar');
  const progressCount = document.getElementById('progress-count');
  const progressTotal = document.getElementById('progress-total');

  progressWrapper.classList.remove('hidden');
  progressBar.value = 0;
  progressCount.innerText = '0';
  progressTotal.innerText = '...';

  try {
    const res = await fetch('/dynamic-trending');
    const trendData = await res.json();
    const trends = trendData.products || [];

    const total = trends.length;
    let completed = 0;
    progressTotal.innerText = total;

    const results = [];

    for (const trend of trends) {
      const trendRes = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: trend.title,
          templateType: detectTemplateFromText(trend.title + ' ' + trend.caption),
          tone
        })
      });

      const result = await trendRes.json();
      results.push({ trend: trend.title, result });

      completed++;
      progressCount.innerText = completed;
      progressBar.value = Math.floor((completed / total) * 100);
    }

    showToast('success', 'Batch complete!');

    // Display each result using your normal UI renderer
    document.getElementById('results').innerHTML = '';
    results.forEach(r => {
      if (r.result?.result) {
        displayResults(r.result, { append: true });
      }
    });
  } catch (err) {
    console.error('❌ Batch generation error:', err);
    showToast('error', 'Batch generation failed.');
  } finally {
    progressWrapper.classList.add('hidden');
  }
});

// 💡 Helper to infer template type from text
function copyTrendSection(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('success', 'Section copied to clipboard!');
  });
}

function copyAllTrendSections() {
  const sections = ['viral-hooks', 'video-script', 'creator-insight'];
  const allText = sections
    .map(id => {
      const el = document.getElementById(id);
      return el ? el.innerText : '';
    })
    .join('\n\n');

  navigator.clipboard.writeText(allText).then(() => {
    showToast('success', 'All sections copied to clipboard!');
  });
}

function detectTemplateFromText(text) {
  const lower = text.toLowerCase();
  if (lower.includes('dupe') || lower.includes('alternative')) return 'drugstoreDupe';
  if (lower.includes('routine')) return 'routineExample';
  if (lower.includes('top 5') || lower.includes('best')) return 'drySkinList';
  if (lower.includes('switch') || lower.includes('why i switched')) return 'whyISwitched';
  if (lower.includes('review')) return 'personalReview';
  if (lower.includes('compare') || lower.includes('vs')) return 'productComparison';
  if (lower.includes('demo') || lower.includes('script')) return 'demoScript';
  if (lower.includes('caption')) return 'influencerCaption';
  return 'surpriseMe';
}