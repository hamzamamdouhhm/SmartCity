import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { statusInfo } from "../utils/formatting";
import ScoreRing from "../components/ScoreRing";
import TrafficLight from "../components/TrafficLight";
import StakeholderSelector from "../components/StakeholderSelector";
import ExportButtons from "../components/ExportButtons";
import MunicipalityMap from "../components/maps/MunicipalityMap";

const MunicipalityDetail = ({ scores, setModal, stakeholder, setStakeholder }) => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;
  const m = BENCHMARK_DATA.municipalities.find(x => x.id === id);
  const isDe = currentLang === "de";
  const stakeholderObj = BENCHMARK_DATA.stakeholders[stakeholder];
  if (!m || !m.id) return <div className="text-center py-20">{t("noData")}</div>;
  const sc = scores && scores[m.id] ? scores[m.id] : {};
  const kpisArr = BENCHMARK_DATA.kpis.map(k => ({ id: k.id, name: k.name[currentLang], score: sc.kpis ? sc.kpis[k.id] : null }));
  const best = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>b.score-a.score)[0];
  const worst = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>a.score-b.score)[0];
  const priorityKpis = stakeholderObj.focus;
  const prioritySubIds = stakeholderObj.priorityIndicators;
  return (
    <div>
      <div className="premium-gradient rounded-3xl p-8 md:p-12 text-white mb-8 hero-pattern relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-4xl glass-card" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{m.name && m.name[currentLang] ? m.name[currentLang] : (m.id || "-")}</h1>
              <div className="text-emerald-100 text-lg">{m.kreis || ""} · {fmt(m.population)} EW</div>
            </div>
            <div className="glass-card rounded-2xl p-5 flex flex-col items-center">
              <div className="text-sm text-emerald-100 mb-1">{t("overallScore")}</div>
              <ScoreRing score={sc.overall} size={100} stroke={10} />
              <div className="mt-2 font-semibold">{sc.completeness !== undefined ? sc.completeness + "%" : "-"} {t("dataCompleteness")}</div>
            </div>
          </div>
        </div>
      </div>

      <StakeholderSelector stakeholder={stakeholder} setStakeholder={setStakeholder} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MunicipalityMap municipality={m} height="450px" />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
            <h3 className="font-bold text-ink mb-3">{isDe ? "Kommunalprofil" : "Municipality Profile"}</h3>
            <div className="space-y-2 text-sm">
              {BENCHMARK_DATA.profileIndicators.map(pi => {
                const pv = BENCHMARK_DATA.values && BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id].profile ? BENCHMARK_DATA.values[m.id].profile[pi.id] : null;
                return (
                  <div key={pi.id} className="flex justify-between">
                    <span className="text-gray-500">{pi.name[currentLang]}</span>
                    <span className="font-mono font-medium">{pv && pv.raw !== null && pv.raw !== undefined ? fmt(pv.raw, pi.unit === "EUR/EW" ? 2 : 1) + " " + pv.unit : "-"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
            <h3 className="font-bold text-ink mb-3">{isDe ? "Stärken & Schwächen" : "Strengths & Weaknesses"}</h3>
            {best && <div className="mb-2"><span className="text-sm text-gray-500">{t("strongestKpi")}:</span> <span className="font-medium text-good">{best.name} {best.score}%</span></div>}
            {worst && <div><span className="text-sm text-gray-500">{t("weakestKpi")}:</span> <span className="font-medium text-low">{worst.name} {worst.score}%</span></div>}
          </div>
          <ExportButtons municipalityIds={[m.id]} stakeholderId={stakeholder} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink mb-4">{isDe ? "KPI-Übersicht" : "KPI Overview"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {BENCHMARK_DATA.kpis.map(kpi => {
          const score = sc.kpis ? sc.kpis[kpi.id] : null;
          const v = BENCHMARK_DATA.values && BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id][kpi.id] ? BENCHMARK_DATA.values[m.id][kpi.id] : { sub: {} };
          const isPriority = priorityKpis.includes(kpi.id);
          return (
            <div key={kpi.id} className={`bg-white rounded-2xl p-5 card-shadow border ${isPriority ? "border-forest/30 ring-1 ring-forest/10" : "border-gray-100"}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-ink">{kpi.name[currentLang]}</h3>
                  {isPriority && <span className="text-xs px-2 py-0.5 rounded bg-forest/10 text-forest font-medium">{isDe ? "Fokus" : "Focus"}</span>}
                </div>
                <TrafficLight score={score} thresholds={kpi.thresholds} showLabel={false} />
              </div>
              <div className="space-y-1 text-sm mb-3">
                {kpi.subIndicators.map(sub => {
                  const sv = v.sub[sub.id];
                  const isPrioritySub = prioritySubIds.includes(sub.id);
                  return (
                    <div key={sub.id} className={`flex justify-between p-1 rounded ${isPrioritySub ? "bg-emerald-50/50" : ""}`}>
                      <span className="text-gray-500">{sub.name[currentLang] || sub.name}</span>
                      <span className="font-mono">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{t("noData")}</span>}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={()=>setModal({ kpi, municipality: m })} className="text-sm text-forest hover:underline">{t("howCalculated")}</button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-ink mb-4">{isDe ? "Vergleich mit anderen Kommunen" : "Comparison with other municipalities"}</h2>
        <div className="space-y-3">
          {BENCHMARK_DATA.kpis.map(kpi => {
            const sorted = [...BENCHMARK_DATA.municipalities].sort((a,b) => {
              const av = scores && scores[a.id] && scores[a.id].kpis ? scores[a.id].kpis[kpi.id] : null;
              const bv = scores && scores[b.id] && scores[b.id].kpis ? scores[b.id].kpis[kpi.id] : null;
              return (bv||0) - (av||0);
            });
            const rank = sorted.findIndex(x => x.id === m.id) + 1;
            const score = sc.kpis ? sc.kpis[kpi.id] : null;
            return (
              <div key={kpi.id} className="flex items-center justify-between p-3 rounded-xl bg-paper">
                <span className="font-medium">{kpi.name[currentLang]}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted">{isDe ? "Platz" : "Rank"} {rank} / {sorted.length}</span>
                  <span className="font-bold" style={{ color: statusInfo(score, kpi.thresholds).color }}>{score !== null && score !== undefined ? score + "%" : "-"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MunicipalityDetail;
