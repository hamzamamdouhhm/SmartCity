import { round } from "./formatting";

export const computeScores = (data, indicatorWeights, categoryWeights) => {
  if (!data) return null;
  const hasCustomInd = indicatorWeights && Object.keys(indicatorWeights).length > 0;
  const hasCustomCat = categoryWeights && Object.keys(categoryWeights).length > 0;
  if (!hasCustomInd && !hasCustomCat) {
    return JSON.parse(JSON.stringify(data.values));
  }
  const scores = JSON.parse(JSON.stringify(data.values));
  for (const m of data.municipalities) {
    const mid = m.id;
    scores[mid].kpis = {};
    for (const cat of data.kpis) {
      const catId = cat.id;
      let num = 0;
      let den = 0;
      for (const sub of cat.subIndicators) {
        const customW = indicatorWeights && indicatorWeights[catId] && indicatorWeights[catId][sub.id];
        const w = customW !== undefined && customW !== null ? customW : sub.weight;
        const sv = scores[mid][catId].sub[sub.id];
        if (sv.normalized !== null && sv.normalized !== undefined) {
          num += sv.normalized * w;
          den += w;
        }
      }
      const catScore = den > 0 ? round(num / den, 1) : null;
      scores[mid][catId].score = catScore;
      scores[mid].kpis[catId] = catScore;
    }
    let onum = 0;
    let oden = 0;
    for (const cat of data.kpis) {
      const s = scores[mid].kpis[cat.id];
      const customCW = categoryWeights && categoryWeights[cat.id];
      const w = customCW !== undefined && customCW !== null ? customCW : cat.weight;
      if (s !== null && s !== undefined) {
        onum += s * w;
        oden += w;
      }
    }
    scores[mid].overall = oden > 0 ? round(onum / oden, 1) : null;
  }
  return scores;
};
