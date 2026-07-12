import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";

const Methodology = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const isDe = currentLang === "de";
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!BENCHMARK_DATA) return;
    const saved = localStorage.getItem("methodologyOpen");
    if (saved) {
      const match = BENCHMARK_DATA.kpis.find(k => k.id === saved);
      if (match) setOpenId(saved);
      localStorage.removeItem("methodologyOpen");
    }
  }, [BENCHMARK_DATA]);

  useEffect(() => {
    if (openId) {
      const el = document.getElementById(`methodology-${openId}`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [openId]);

  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-2">{t("methodology")}</h1>
      <p className="text-gray-600 mb-8">{isDe ? "Transparente Dokumentation aller Berechnungsmethoden." : "Transparent documentation of all calculation methods."}</p>
      <div className="space-y-4">
        {BENCHMARK_DATA.kpis.map(kpi => (
          <div key={kpi.id} id={`methodology-${kpi.id}`} className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
            <button onClick={()=>setOpenId(openId===kpi.id?null:kpi.id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: ["#064E3B", "#1A3A4A", "#D4A017", "#7A4E6D"][BENCHMARK_DATA.kpis.indexOf(kpi)] }}>{kpi.name[currentLang][0]}</div>
                <div>
                  <h3 className="font-bold text-ink">{kpi.name[currentLang]}</h3>
                  <div className="text-xs text-muted">{kpi.source[currentLang] || kpi.source}</div>
                </div>
              </div>
              <span className="text-xl text-gray-400">{openId===kpi.id ? "−" : "+"}</span>
            </button>
            {openId===kpi.id && (
              <div className="p-5 border-t border-gray-100 bg-paper/50">
                <p className="text-gray-700 mb-4">{kpi.description[currentLang]}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">{isDe ? "Mathematische Formel" : "Mathematical formula"}</h4>
                  <div className="font-mono text-sm bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto">{kpi.formula}</div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">{isDe ? "Teilindikatoren und Gewichtung" : "Sub-indicators and weights"}</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {kpi.subIndicators.map(sub => (
                      <li key={sub.id} className="bg-white p-3 rounded-lg border border-gray-100 text-sm">
                        <div className="font-medium">{sub.name[currentLang] || sub.name}</div>
                        <div className="text-muted">{isDe ? "Gewicht: " : "Weight: "}{fmt(sub.weight*100,0)}% · {isDe ? "Einheit: " : "Unit: "}{sub.unit} · {sub.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better")}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">{isDe ? "Ampelschwellen" : "Traffic-light thresholds"}</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">{isDe ? "Grün" : "Green"}: ≥{kpi.thresholds.green}%</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800">{isDe ? "Gelb" : "Yellow"}: {kpi.thresholds.yellow}–{kpi.thresholds.green-1}%</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800">{isDe ? "Rot" : "Red"}: {'<'} {kpi.thresholds.yellow}%</span>
                  </div>
                </div>
                <div className="text-xs text-muted">{isDe ? "Letztes Update" : "Last update"}: {kpi.lastUpdate}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Methodology;
