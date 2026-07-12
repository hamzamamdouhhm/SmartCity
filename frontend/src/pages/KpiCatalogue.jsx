import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";

const KpiCatalogue = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const isDe = currentLang === "de";
  const [filter, setFilter] = useState("all");
  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;
  const cats = BENCHMARK_DATA.kpis;
  const indicators = BENCHMARK_DATA.indicatorCatalogue || [];
  const filtered = filter === "all" ? indicators : indicators.filter(ind => ind.category === filter);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-ink">{isDe ? "KPI-Katalog" : "KPI Catalogue"}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter==="all"?"bg-forest text-white":"bg-white border"}`}>{isDe ? "Alle" : "All"}</button>
          {cats.map(cat => <button key={cat.id} onClick={()=>setFilter(cat.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter===cat.id?"bg-forest text-white":"bg-white border"}`}>{cat.name[currentLang]}</button>)}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
        <h2 className="font-semibold mb-2">{isDe ? "Methodik" : "Methodology"}</h2>
        <p className="text-sm text-gray-700 mb-2">{BENCHMARK_DATA.methodology.normalization[isDe ? "de" : "en"]}</p>
        <p className="text-sm text-gray-700">{isDe ? "Kategorie-Score = gewichteter Durchschnitt der zugehörigen Indikatoren." : "Category score = weighted average of the related indicators."}</p>
      </div>
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-paper">
            <tr>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "KPI" : "KPI"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Kategorie" : "Category"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Einheit" : "Unit"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Jahr" : "Year"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Quelle" : "Source"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Richtung" : "Direction"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Gewicht" : "Weight"}</th>
              <th className="text-left p-4 font-semibold text-ink">{isDe ? "Formel" : "Formula"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ind => {
              const cat = cats.find(c => c.id === ind.category);
              return (
                <tr key={ind.id} className="border-t border-gray-100">
                  <td className="p-4 align-top">
                    <div className="font-semibold text-ink">{ind.name[currentLang] || ind.name}</div>
                    <div className="text-xs text-muted max-w-xs">{ind.description ? (ind.description[currentLang] || ind.description) : ""}</div>
                  </td>
                  <td className="p-4 align-top">{cat ? cat.name[currentLang] : "-"}</td>
                  <td className="p-4 align-top font-mono">{ind.unit}</td>
                  <td className="p-4 align-top">{indicators.find(x=>x.id===ind.id) && BENCHMARK_DATA.values && BENCHMARK_DATA.values["landsberg"] && BENCHMARK_DATA.values["landsberg"][ind.category] && BENCHMARK_DATA.values["landsberg"][ind.category].sub && BENCHMARK_DATA.values["landsberg"][ind.category].sub[ind.id] ? (BENCHMARK_DATA.values["landsberg"][ind.category].sub[ind.id].date || "-") : "-"}</td>
                  <td className="p-4 align-top text-muted">{ind.source || "-"}</td>
                  <td className="p-4 align-top">{ind.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better")}</td>
                  <td className="p-4 align-top">{fmt(ind.weight*100,1)}%</td>
                  <td className="p-4 align-top font-mono text-xs">{ind.formula}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KpiCatalogue;
