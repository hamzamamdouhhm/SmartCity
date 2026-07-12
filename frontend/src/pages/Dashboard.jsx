import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import { fmt, round, statusInfo, getLocalized } from "../utils/formatting";
import ScoreRing from "../components/ScoreRing";
import StakeholderSelector from "../components/StakeholderSelector";
import ExportButtons from "../components/ExportButtons";
import Chart from "chart.js/auto";

const Dashboard = ({ scores, setCategoryModal, stakeholder, setStakeholder }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const isDe = currentLang === "de";
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !BENCHMARK_DATA) return;
    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: BENCHMARK_DATA.municipalities.map(m => getLocalized(m.name, currentLang)),
        datasets: BENCHMARK_DATA.kpis.map((kpi, i) => (
          { label: getLocalized(kpi.name, currentLang), data: BENCHMARK_DATA.municipalities.map(m => scores && scores[m.id] && scores[m.id].kpis ? (scores[m.id].kpis[kpi.id] || 0) : 0), backgroundColor: ["#064E3B", "#1A3A4A", "#D4A017", "#7A4E6D"][i] }
        ))
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });
    return () => chart.destroy();
  }, [scores, BENCHMARK_DATA, currentLang]);

  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;

  const sorted = [...BENCHMARK_DATA.municipalities].sort((a,b) => ((scores && scores[b.id] ? scores[b.id].overall : 0)||0) - ((scores && scores[a.id] ? scores[a.id].overall : 0)||0));

  return (
    <div>
      <section className="premium-gradient rounded-3xl p-8 md:p-12 text-white mb-8 hero-pattern">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t("appTitle")}</h1>
          <p className="text-lg md:text-xl text-emerald-100">{t("appSubtitle")}</p>
        </div>
      </section>
      <StakeholderSelector stakeholder={stakeholder} setStakeholder={setStakeholder} />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {BENCHMARK_DATA.kpis.map(kpi => {
          const avgScore = (() => {
            const vals = BENCHMARK_DATA.municipalities.map(m => scores[m.id].kpis[kpi.id]).filter(s => s !== null && s !== undefined);
            return vals.length ? round(vals.reduce((a,b)=>a+b,0)/vals.length,1) : null;
          })();
          return (
            <div key={kpi.id} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-sm">{getLocalized(kpi.name, currentLang).substring(0,2)}</div>
                <ScoreRing score={avgScore} size={56} stroke={5} />
              </div>
                <h3 className="text-lg font-bold text-ink mb-1">{getLocalized(kpi.name, currentLang)}</h3>
                <p className="text-xs text-muted mb-3 line-clamp-2">{getLocalized(kpi.description, currentLang)}</p>

              <div className="text-xs text-gray-500 mb-3">{isDe ? "Gewicht:" : "Weight:"} {fmt(kpi.weight*100,0)}%</div>
              <button onClick={()=>setCategoryModal({ kpi })} className="w-full py-1.5 text-sm font-medium text-forest bg-forest/5 rounded-lg hover:bg-forest/10">{isDe ? "Details anzeigen" : "Show details"}</button>
            </div>
          );
        })}
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {BENCHMARK_DATA.municipalities.map(m => {
          if (!m || !m.id) return null;
          const sc = scores && scores[m.id] ? scores[m.id] : {};
          const kpisArr = BENCHMARK_DATA.kpis.map(k => ({ id: k.id, name: getLocalized(k.name, currentLang), score: sc.kpis ? sc.kpis[k.id] : null }));
          const best = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>b.score-a.score)[0];
          const worst = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>a.score-b.score)[0];
          return (
            <Link key={m.id} to={`/municipality/${m.id}`} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100 block">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: m.color || "#064E3B" }}>{getLocalized(m.name, currentLang)[0] || "?"}</div>
                <ScoreRing score={sc.overall} size={56} stroke={5} />
              </div>
              <h3 className="text-lg font-bold text-ink mb-1">{getLocalized(m.name, currentLang) || m.id}</h3>
              <div className="text-xs text-muted mb-3">{m.kreis || ""} · {fmt(m.population)} EW</div>
              <div className="space-y-1 text-sm">
                {best && <div className="flex justify-between"><span className="text-gray-500">{t("strongestKpi")}:</span><span className="font-medium text-good">{best.name}</span></div>}
                {worst && <div className="flex justify-between"><span className="text-gray-500">{t("weakestKpi")}:</span><span className="font-medium text-low">{worst.name}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">{t("dataCompleteness")}:</span><span className="font-medium">{sc.completeness !== undefined ? sc.completeness + "%" : "-"}</span></div>
              </div>
            </Link>
          );
        })}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <h2 className="text-xl font-bold text-ink mb-4">{isDe ? "Vergleich der KPIs" : "KPI Comparison"}</h2>
          <canvas ref={chartRef} height="200"></canvas>
        </div>
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <h2 className="text-xl font-bold text-ink mb-4">{t("ranking")}</h2>
          <ol className="space-y-3">
            {sorted.map((m, i) => {
              if (!m || !m.id) return null;
              const ov = scores && scores[m.id] ? scores[m.id].overall : null;
              return (
                <li key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-paper">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">{i+1}</span>
                    <span className="font-medium">{getLocalized(m.name, currentLang) || m.id}</span>
                  </div>
                  <span className="font-bold" style={{ color: statusInfo(ov, BENCHMARK_DATA.config.scoreThresholds).color }}>{ov !== null && ov !== undefined ? ov + "%" : "-"}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      <section className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-ink">{isDe ? "Export" : "Export"}</h2>
          <ExportButtons municipalityIds={BENCHMARK_DATA.municipalities.map(m=>m.id)} stakeholderId={stakeholder} />
        </div>
        <p className="text-sm text-gray-600">{isDe ? "Exportieren Sie alle Kommunen mit der aktuellen Stakeholder-Sicht als PDF, Excel oder CSV." : "Export all municipalities with the current stakeholder view as PDF, Excel or CSV."}</p>
      </section>
    </div>
  );
};

export default Dashboard;
