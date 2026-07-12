import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { statusInfo } from "../utils/formatting";

const Ranking = ({ scores, categoryWeights }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;
  const isDe = currentLang === "de";
  const categories = [{id: "overall", name: t("overallScore")}, ...BENCHMARK_DATA.kpis.map(k => ({ id: k.id, name: k.name[currentLang] }))];
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-ink">{t("ranking")}</h1>
        <Link to="/weights" className="px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium hover:bg-forest/90">{isDe ? "Gewichtung anpassen" : "Adjust weights"}</Link>
      </div>
      <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
        <h2 className="font-semibold mb-2">{isDe ? "Aktive Gewichtung" : "Active weights"}</h2>
        <div className="flex flex-wrap gap-3">
          {BENCHMARK_DATA.kpis.map(k => <span key={k.id} className="px-3 py-1 rounded-lg bg-paper text-sm">{k.name[currentLang]}: {fmt((categoryWeights && categoryWeights[k.id] !== undefined ? categoryWeights[k.id] : k.weight)*100,0)}%</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => {
          const list = [...BENCHMARK_DATA.municipalities].sort((a,b) => {
            const av = cat.id === "overall" ? (scores && scores[a.id] ? scores[a.id].overall : null) : (scores && scores[a.id] && scores[a.id].kpis ? scores[a.id].kpis[cat.id] : null);
            const bv = cat.id === "overall" ? (scores && scores[b.id] ? scores[b.id].overall : null) : (scores && scores[b.id] && scores[b.id].kpis ? scores[b.id].kpis[cat.id] : null);
            return (bv||0) - (av||0);
          });
          return (
            <div key={cat.id} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
              <h3 className="font-bold text-ink mb-3">{cat.name}</h3>
              <ol className="space-y-2">
                {list.map((m, i) => {
                  if (!m || !m.id) return null;
                  const score = cat.id === "overall" ? (scores && scores[m.id] ? scores[m.id].overall : null) : (scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[cat.id] : null);
                  const info = statusInfo(score, BENCHMARK_DATA.config.scoreThresholds);
                  return (
                    <li key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-paper">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-xs flex items-center justify-center font-bold">{i+1}</span>
                        <span className="text-sm font-medium">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: info.color }}>{score !== null && score !== undefined ? score + "%" : "-"}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ranking;
