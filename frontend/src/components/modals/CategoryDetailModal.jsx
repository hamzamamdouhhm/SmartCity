import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../../hooks/useData";
import { fmt } from "../../utils/formatting";
import TrafficLight from "../TrafficLight";

const CategoryDetailModal = ({ kpi, onClose, scores }) => {
  const { i18n, t } = useTranslation();
  const { data } = useData();
  if (!kpi || !data) return null;
  const lang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = lang === "de";
  // Min/max per sub-indicator for normalization
  const subStats = kpi.subIndicators.map(sub => {
    const allRaw = data.municipalities.map(m => {
      const sv = data.values && data.values[m.id] && data.values[m.id][kpi.id] && data.values[m.id][kpi.id].sub ? data.values[m.id][kpi.id].sub[sub.id] : { raw: null };
      return sv.raw;
    }).filter(r => r !== null && r !== undefined);
    return { sub, min: allRaw.length ? Math.min(...allRaw) : null, max: allRaw.length ? Math.max(...allRaw) : null };
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 card-shadow" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">{kpi.name[lang]}</h2>
            <div className="text-muted text-sm">{isDe ? "Vergleich aller Kommunen" : "Comparison of all municipalities"}</div>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-ink">×</button>
        </div>
        <p className="text-gray-700 mb-4">{kpi.description[lang]}</p>
        <div className="mb-4 p-4 rounded-xl bg-paper border border-gray-100">
          <h3 className="font-semibold mb-2">{isDe ? "Formel" : "Formula"}</h3>
          <div className="font-mono text-sm bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto mb-3">{kpi.formula}</div>
          <h3 className="font-semibold mb-2">{isDe ? "Normierung je Indikator" : "Normalization per indicator"}</h3>
          <div className="font-mono text-sm bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto">
              {subStats.map(({ sub, min, max }) => {
                if (min === null || max === null || min === max) return <div key={sub.id}>{sub.name[lang] || sub.name}: {isDe ? "keine Varianz" : "no variance"}</div>;
                const dir = sub.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better");
                const formula = sub.higherIsBetter ? (isDe ? "(Wert − Min) / (Max − Min) × 100" : "(Value − Min) / (Max − Min) × 100") : (isDe ? "(Max − Wert) / (Max − Min) × 100" : "(Max − Value) / (Max − Min) × 100");
                return <div key={sub.id}>{sub.name[lang] || sub.name}: {dir}, Min={fmt(min,2)}, Max={fmt(max,2)} → {formula}</div>;
              })}

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-paper">
              <tr className="text-left text-muted border-b">
                <th className="p-3">{isDe ? "Kommune" : "Municipality"}</th>
                <th className="p-3">{isDe ? "Gesamtscore" : "Total score"}</th>
                {kpi.subIndicators.map(sub => <th key={sub.id} className="p-3">{sub.name[lang] || sub.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.municipalities.map(m => {
                const score = scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[kpi.id] : null;
                return (
                  <tr key={m.id} className="border-b border-gray-50">
                    <td className="p-3 font-medium">{m.name && m.name[lang] ? m.name[lang] : m.id}</td>
                    <td className="p-3"><TrafficLight score={score} thresholds={kpi.thresholds} /></td>
                    {kpi.subIndicators.map(sub => {
                      const sv = data.values && data.values[m.id] && data.values[m.id][kpi.id] && data.values[m.id][kpi.id].sub ? data.values[m.id][kpi.id].sub[sub.id] : { raw: null, normalized: null, unit: sub.unit };
                      return (
                        <td key={sub.id} className="p-3">
                          <div className="font-mono">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{t("noData")}</span>}</div>
                          <div className="text-xs text-muted">{sv.normalized !== null && sv.normalized !== undefined ? fmt(sv.normalized, 0) + "%" : "-"}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-muted mt-4">{isDe ? "Datenquelle KPI: " : "KPI data source: "}{kpi.source[lang] || kpi.source} · {isDe ? "Letztes Update: " : "Last update: "}{kpi.lastUpdate}</div>
      </div>
    </div>
  );
};

export default CategoryDetailModal;
