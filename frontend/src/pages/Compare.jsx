import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import TrafficLight from "../components/TrafficLight";
import StakeholderSelector from "../components/StakeholderSelector";
import ExportButtons from "../components/ExportButtons";

const Compare = ({ scores, setModal, stakeholder, setStakeholder }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const isDe = currentLang === "de";
  const [showRaw, setShowRaw] = useState(false);
  const [level, setLevel] = useState("category");
  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;
  const allIndicators = BENCHMARK_DATA.kpis.flatMap(k => k.subIndicators.map(sub => ({ ...sub, categoryId: k.id, categoryName: k.name[currentLang] })));
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-ink">{t("comparison")}</h1>
        <ExportButtons municipalityIds={BENCHMARK_DATA.municipalities.map(m=>m.id)} stakeholderId={stakeholder} />
      </div>
      <StakeholderSelector stakeholder={stakeholder} setStakeholder={setStakeholder} />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-gray-500">{isDe ? "Ebene:" : "Level:"}</span>
        <button onClick={()=>setLevel("category")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${level==="category"?"bg-forest text-white":"bg-white border"}`}>{isDe ? "Kategorien" : "Categories"}</button>
        <button onClick={()=>setLevel("indicator")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${level==="indicator"?"bg-forest text-white":"bg-white border"}`}>{isDe ? "Einzel-KPIs" : "Individual KPIs"}</button>
        <span className="text-sm text-gray-500 ml-2">{isDe ? "Ansicht:" : "View:"}</span>
        <button onClick={()=>setShowRaw(false)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!showRaw ? "bg-forest text-white" : "bg-white border"}`}>{t("score")}</button>
        <button onClick={()=>setShowRaw(true)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${showRaw ? "bg-forest text-white" : "bg-white border"}`}>{t("rawValue")}</button>
      </div>
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-paper">
            <tr>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Kennzahl" : "Indicator"}</th>
              {BENCHMARK_DATA.municipalities.map(m => m && m.id ? <th key={m.id} className="p-4 text-center font-semibold text-ink">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</th> : null)}
            </tr>
          </thead>
          <tbody>
            {level === "category" ? BENCHMARK_DATA.kpis.map(kpi => (
              <tr key={kpi.id} className="border-t border-gray-100">
                <td className="p-4 align-top">
                  <div className="font-semibold text-ink">{kpi.name[currentLang]}</div>
                  <div className="text-xs text-muted">{fmt(kpi.weight*100,0)}% · {kpi.subIndicators.length} {isDe ? "Indikatoren" : "indicators"}</div>
                  <button onClick={()=>setModal({ kpi, municipality: BENCHMARK_DATA.municipalities[0] })} className="text-xs text-forest hover:underline mt-1">{t("howCalculated")}</button>
                </td>
                {BENCHMARK_DATA.municipalities.map(m => {
                  if (!m || !m.id) return null;
                  const score = scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[kpi.id] : null;
                  return (
                    <td key={m.id} className="p-4 align-top">
                      <div className="flex flex-col items-center gap-2">
                        {!showRaw ? (
                          <TrafficLight score={score} thresholds={kpi.thresholds} />
                        ) : (
                          <div className="text-center font-mono font-medium">{score !== null && score !== undefined ? score + " " + (kpi.unit[currentLang] || "") : <span className="text-gray-400 italic">{t("noData")}</span>}</div>
                        )}
                        <button onClick={()=>setModal({ kpi, municipality: m })} className="text-xs text-gray-400 hover:text-forest">{isDe ? "Details" : "Details"}</button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            )) : allIndicators.map(ind => (
              <tr key={ind.id} className="border-t border-gray-100">
                <td className="p-4 align-top">
                  <div className="font-semibold text-ink">{ind.name[currentLang] || ind.name}</div>
                  <div className="text-xs text-muted">{ind.categoryName} · {fmt(ind.weight*100,1)}%</div>
                </td>
                {BENCHMARK_DATA.municipalities.map(m => {
                  if (!m || !m.id) return null;
                  const sv = scores && scores[m.id] && scores[m.id][ind.categoryId] && scores[m.id][ind.categoryId].sub ? scores[m.id][ind.categoryId].sub[ind.id] : { raw: null, normalized: null, unit: ind.unit };
                  return (
                    <td key={m.id} className="p-4 align-top">
                      <div className="flex flex-col items-center gap-1">
                        {!showRaw ? (
                          <TrafficLight score={sv.normalized} thresholds={BENCHMARK_DATA.config.scoreThresholds} />
                        ) : (
                          <div className="text-center font-mono font-medium">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{t("noData")}</span>}</div>
                        )}
                        <div className="text-xs text-muted">{sv.normalized !== null && sv.normalized !== undefined ? fmt(sv.normalized,1) + "%" : "-"}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
