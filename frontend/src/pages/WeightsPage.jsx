import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../hooks/useData";
import { fmt, round } from "../utils/formatting";

const WeightsPage = ({ indicatorWeights, setIndicatorWeights, categoryWeights, setCategoryWeights, resetWeights }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  if (!BENCHMARK_DATA) return <div className="text-center py-20">Loading...</div>;
  const isDe = currentLang === "de";
  const updateIndWeight = (catId, indId, val) => {
    const v = Math.max(0, Math.min(100, parseFloat(val) || 0));
    setIndicatorWeights(prev => ({ ...prev, [catId]: { ...(prev[catId] || {}), [indId]: v / 100 } }));
  };
  const updateCatWeight = (catId, val) => {
    const v = Math.max(0, Math.min(100, parseFloat(val) || 0));
    setCategoryWeights(prev => ({ ...prev, [catId]: v / 100 }));
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-ink">{isDe ? "Gewichtung" : "Weights"}</h1>
        <button onClick={resetWeights} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90">{isDe ? "Zurücksetzen" : "Reset"}</button>
      </div>
      <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
        <h2 className="font-semibold mb-2">{isDe ? "Kategorie-Gewichtung" : "Category weights"}</h2>
        <p className="text-sm text-gray-600 mb-4">{isDe ? "Beeinflusst den Gesamtscore." : "Influences the overall score."}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BENCHMARK_DATA.kpis.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-paper">
              <span className="font-medium">{cat.name[currentLang]}</span>
              <div className="flex items-center gap-2">
                <input type="range" min="0" max="100" value={round(((categoryWeights && categoryWeights[cat.id] !== undefined ? categoryWeights[cat.id] : cat.weight))*100,0)} onChange={e=>updateCatWeight(cat.id, e.target.value)} className="w-32" />
                <span className="w-12 text-right font-mono text-sm">{fmt((categoryWeights && categoryWeights[cat.id] !== undefined ? categoryWeights[cat.id] : cat.weight)*100,0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {BENCHMARK_DATA.kpis.map(cat => (
        <div key={cat.id} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
          <h2 className="font-semibold mb-4">{cat.name[currentLang]} · {isDe ? "Indikator-Gewichtung" : "Indicator weights"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cat.subIndicators.map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-paper">
                <span className="text-sm">{sub.name[currentLang] || sub.name}</span>
                <div className="flex items-center gap-2">
                  <input type="range" min="0" max="100" value={round(((indicatorWeights && indicatorWeights[cat.id] && indicatorWeights[cat.id][sub.id] !== undefined ? indicatorWeights[cat.id][sub.id] : sub.weight))*100,0)} onChange={e=>updateIndWeight(cat.id, sub.id, e.target.value)} className="w-32" />
                  <span className="w-12 text-right font-mono text-sm">{fmt((indicatorWeights && indicatorWeights[cat.id] && indicatorWeights[cat.id][sub.id] !== undefined ? indicatorWeights[cat.id][sub.id] : sub.weight)*100,0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeightsPage;
