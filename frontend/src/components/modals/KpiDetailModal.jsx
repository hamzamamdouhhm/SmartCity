import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../../hooks/useData";
import { fmt } from "../../utils/formatting";
import ScoreRing from "../ScoreRing";

const KpiDetailModal = ({ kpi, municipality, onClose, scores }) => {
  const { i18n, t } = useTranslation();
  const { data } = useData();
  if (!kpi || !municipality || !data) return null;
  const v = data.values[municipality.id][kpi.id];
  const score = scores[municipality.id].kpis[kpi.id];
  const lang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = lang === "de";
  // Compute calculation values per sub-indicator
  const calcSubs = kpi.subIndicators.map(sub => {
    const sv = v.sub[sub.id];
    const allRaw = data.municipalities.map(m => {
      const val = data.values[m.id] && data.values[m.id][kpi.id] && data.values[m.id][kpi.id].sub ? data.values[m.id][kpi.id].sub[sub.id].raw : null;
      return val;
    }).filter(r => r !== null && r !== undefined);
    const min = allRaw.length ? Math.min(...allRaw) : null;
    const max = allRaw.length ? Math.max(...allRaw) : null;
    let norm = null;
    let weighted = null;
    if (sv.raw !== null && sv.raw !== undefined && min !== null && max !== null && min !== max) {
      norm = sub.higherIsBetter ? ((sv.raw - min) / (max - min)) * 100 : ((max - sv.raw) / (max - min)) * 100;
      weighted = norm * sub.weight;
    }
    return { sub, sv, min, max, norm, weighted };
  });
  const totalWeight = calcSubs.reduce((sum, s) => s.norm !== null ? sum + s.sub.weight : sum, 0);
  const totalWeighted = calcSubs.reduce((sum, s) => s.weighted !== null ? sum + s.weighted : sum, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 card-shadow" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">{kpi.name[lang]}</h2>
            <div className="text-muted text-sm">{municipality.name[lang]}</div>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-ink">×</button>
        </div>
        <div className="mb-4 p-4 rounded-xl bg-paper border border-gray-100">
          <div className="text-sm text-muted mb-1">{isDe ? "Gesamtscore" : "Overall score"}</div>
          <div className="flex items-center gap-3">
            <ScoreRing score={score} size={72} stroke={8} />
            <div className="text-lg font-semibold" style={{ color: score >= kpi.thresholds.green ? "#059669" : score >= kpi.thresholds.yellow ? "#D97706" : "#DC2626" }}>
              {score !== null ? (isDe ? (score >= kpi.thresholds.green ? "Hervorragend" : score >= kpi.thresholds.yellow ? "Gut" : "Schwach") : (score >= kpi.thresholds.green ? "Excellent" : score >= kpi.thresholds.yellow ? "Good" : "Weak")) : "-"}
            </div>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{kpi.description[lang]}</p>
        <h3 className="font-semibold mb-2">{isDe ? "Formel" : "Formula"}</h3>
        <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg mb-4 overflow-x-auto">{kpi.formula}</div>
        <h3 className="font-semibold mb-2">{isDe ? "Berechnung" : "Calculation"}</h3>
        <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg mb-4 overflow-x-auto">
          {calcSubs.map(({ sub, sv, min, max, norm, weighted }, idx) => {
            if (sv.raw === null || sv.raw === undefined || min === null || max === null || min === max) {
              return <div key={sub.id} className={idx > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>{sub.name[lang] || sub.name}: {isDe ? "Keine Berechnung möglich" : "No calculation possible"}</div>;
            }
            const formulaText = sub.higherIsBetter ? (isDe ? "(Wert − Min) / (Max − Min) × 100" : "(Value − Min) / (Max − Min) × 100") : (isDe ? "(Max − Wert) / (Max − Min) × 100" : "(Max − Value) / (Max − Min) × 100");
            const substText = sub.higherIsBetter ? `(${fmt(sv.raw,2)} − ${fmt(min,2)}) / (${fmt(max,2)} − ${fmt(min,2)}) × 100 = ${fmt(norm,1)}%` : `(${fmt(max,2)} − ${fmt(sv.raw,2)}) / (${fmt(max,2)} − ${fmt(min,2)}) × 100 = ${fmt(norm,1)}%`;
            return (
              <div key={sub.id} className={idx > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>
                <div className="font-semibold">{sub.name[lang] || sub.name}</div>
                <div className="pl-2">{isDe ? "Normierung" : "Normalization"}: {formulaText}</div>
                <div className="pl-2">{substText}</div>
                <div className="pl-2">{isDe ? "Gewichteter Beitrag" : "Weighted contribution"}: {fmt(norm,1)}% × {fmt(sub.weight*100,0)}% = {fmt(weighted,2)}</div>
              </div>
            );
          })}
          <div className="mt-3 pt-2 border-t border-gray-400 font-semibold">
            {isDe ? "Kategorie-Score" : "Category score"} = {totalWeighted > 0 ? `${fmt(totalWeighted,2)} / ${fmt(totalWeight,2)} = ${fmt(score,1)}` : (isDe ? "nicht berechenbar" : "not calculable")}
          </div>
        </div>
        <h3 className="font-semibold mb-2">{isDe ? "Rohdaten und Quellen" : "Raw data and sources"}</h3>
        <table className="w-full text-sm mb-4">
          <thead><tr className="text-left text-muted border-b"><th className="pb-2">{isDe ? "Indikator" : "Indicator"}</th><th className="pb-2">{isDe ? "Rohwert" : "Raw value"}</th><th className="pb-2">{isDe ? "Richtung" : "Direction"}</th><th className="pb-2">{isDe ? "Gewicht" : "Weight"}</th><th className="pb-2">{isDe ? "Normiert" : "Normalized"}</th><th className="pb-2">{isDe ? "Quelle" : "Source"}</th><th className="pb-2">{isDe ? "Jahr" : "Year"}</th></tr></thead>
          <tbody>
            {kpi.subIndicators.map(sub => {
              const sv = v.sub[sub.id];
              return (
                <tr key={sub.id} className="border-b border-gray-50">
                  <td className="py-2 font-medium">{sub.name[lang] || sub.name}</td>
                  <td className="py-2">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{t("noData")}</span>}</td>
                  <td className="py-2 text-xs">{sub.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better")}</td>
                  <td className="py-2 text-muted">{fmt(sub.weight*100,0)}%</td>
                  <td className="py-2">{sv.normalized !== null && sv.normalized !== undefined ? sv.normalized + "%" : "-"}</td>
                  <td className="py-2 text-muted">{sv.source || "-"}</td>
                  <td className="py-2 text-muted">{sv.date || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-xs text-muted">{isDe ? "Datenquelle KPI: " : "KPI data source: "}{kpi.source[lang] || kpi.source} · {isDe ? "Letztes Update: " : "Last update: "}{kpi.lastUpdate}</div>
      </div>
    </div>
  );
};

export default KpiDetailModal;
