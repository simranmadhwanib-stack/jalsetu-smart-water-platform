const categoryKeywords = {
  no_supply: ['no water', 'not coming', 'dry', 'empty', 'supply band', 'pani nahi'],
  low_pressure: ['pressure', 'slow', 'kam pressure', 'low flow'],
  quality: ['dirty', 'smell', 'muddy', 'contaminated', 'bad taste', 'ganda'],
  leakage: ['leak', 'burst', 'pipe', 'overflow', 'seepage'],
  tanker_delay: ['tanker', 'late', 'driver', 'arrival', 'delayed'],
  billing: ['bill', 'meter', 'charge', 'payment']
};

export function categorizeComplaint(text = '') {
  const normalized = text.toLowerCase();
  const found = Object.entries(categoryKeywords).find(([, words]) => words.some((word) => normalized.includes(word)));
  const criticalWords = ['emergency', 'hospital', 'school', 'critical', 'burst', 'contaminated'];
  return {
    category: found ? found[0] : 'other',
    priority: criticalWords.some((word) => normalized.includes(word)) ? 'critical' : found?.[0] === 'quality' ? 'high' : 'medium'
  };
}

export function predictAreaDemand(area, historical = []) {
  const baseDemand = Math.max(20, (area?.population || 1000) * 0.135);
  const recentAverage = historical.length
    ? historical.reduce((sum, item) => sum + (item.waterDeliveredKL || 0), 0) / historical.length
    : baseDemand;
  const heatFactor = 1.08;
  const demandForecastKL = Math.round(((baseDemand * 0.45) + (recentAverage * 0.55)) * heatFactor);
  const storage = area?.storageCapacityKL || demandForecastKL;
  const shortageProbability = Math.min(0.95, Math.max(0.05, (demandForecastKL - storage * ((area?.currentAvailabilityPercent || 70) / 100)) / demandForecastKL));
  return {
    demandForecastKL,
    shortageProbability: Number(shortageProbability.toFixed(2)),
    risk: shortageProbability > 0.65 ? 'high' : shortageProbability > 0.35 ? 'medium' : 'low'
  };
}

export function chatbotReply(question = '', context = {}) {
  const q = question.toLowerCase();
  if (q.includes('schedule') || q.includes('time') || q.includes('pani kab')) {
    return `Your next supply is ${context.nextSchedule || 'shown on the schedule page'}. You will receive a reminder before it starts.`;
  }
  if (q.includes('complaint')) return 'Open Complaint Portal, upload a photo if available, and JalSetu will track status until resolution.';
  if (q.includes('tanker')) return 'Use Tanker Tracking to see the assigned tanker, ETA, capacity, and QR verification code.';
  if (q.includes('save') || q.includes('tips')) return 'Save water by fixing leaks, reusing RO discharge for cleaning, and storing only what you need.';
  return 'I can help with water schedules, tanker ETA, complaints, emergency SOS requests, and water-saving tips.';
}
