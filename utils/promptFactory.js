// utils/promptFactory.js

function detectTemplate(trend) {
  const text = (trend.title + ' ' + trend.caption).toLowerCase();

  if (text.includes('dupe') || text.includes('alternative')) return 'drugstoreDupe';
  if (text.includes('routine')) return 'routineExample';
  if (text.includes('top 5') || text.includes('best')) return 'drySkinList';
  if (text.includes('switch') || text.includes('why i switched')) return 'whyISwitched';
  if (text.includes('review')) return 'personalReview';
  if (text.includes('compare') || text.includes('vs')) return 'productComparison';
  if (text.includes('demo') || text.includes('script')) return 'demoScript';
  if (text.includes('caption')) return 'influencerCaption';
  return 'surpriseMe'; // fallback
}

function promptFactory(trend, tone = '') {
  const templateType = detectTemplate(trend);

  return {
    product: trend.title,
    templateType,
    tone,
    metadata: {
      platform: trend.platform,
      likes: trend.likes || 0,
      caption: trend.caption || '',
    }
  };
}

module.exports = promptFactory;