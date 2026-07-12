import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  FileText,
  MapPin,
  BarChart3,
  GitCompare,
  Activity,
} from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt, getLocalized } from "../utils/formatting";
import ScoreRing from "../components/ScoreRing";
import TrafficLight from "../components/TrafficLight";
import ExportButtons from "../components/ExportButtons";
import MunicipalityMap from "../components/maps/MunicipalityMap";
import { Badge, Breadcrumb, Button, Card, PageSection } from "../components/ui";

const MunicipalityDetail = ({ scores, setModal, stakeholder, _setStakeholder }) => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();

  if (!BENCHMARK_DATA) return null;

  const m = BENCHMARK_DATA.municipalities.find((x) => x.id === id);
  const stakeholderObj = BENCHMARK_DATA.stakeholders[stakeholder];

  if (!m || !m.id) {
    return <div className="text-center py-20 text-text-secondary">{t("noData")}</div>;
  }

  const sc = scores && scores[m.id] ? scores[m.id] : {};
  const kpisArr = BENCHMARK_DATA.kpis.map((k) => ({
    id: k.id,
    name: k.name[currentLang],
    score: sc.kpis ? sc.kpis[k.id] : null,
  }));
  const best = kpisArr
    .filter((k) => k.score !== null && k.score !== undefined)
    .sort((a, b) => b.score - a.score)[0];
  const worst = kpisArr
    .filter((k) => k.score !== null && k.score !== undefined)
    .sort((a, b) => a.score - b.score)[0];
  const priorityKpis = stakeholderObj.focus;
  const prioritySubIds = stakeholderObj.priorityIndicators;

  const name = getLocalized(m.name, currentLang) || m.id;

  return (
    <div className="animate-fade-in-up">
      <Breadcrumb
        items={[
          { to: "/municipalities", label: t("municipalities") },
          { label: name },
        ]}
        className="mb-4"
      />

      {/* Hero */}
      <section className="hero-saas rounded-xl p-8 md:p-10 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/municipalities">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="mb-4"
            >
              {t("backToOverview")}
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-text-inverse font-bold text-4xl border-2 border-text-inverse/20 shadow-md"
              style={{ background: m.color || "hsl(var(--color-brand-600))" }}
            >
              {name[0] || "?"}
            </div>
            <div className="flex-1">
              <h1 className="text-h1 md:text-[3rem] font-display text-text-primary font-bold mb-2 tracking-tight">{name}</h1>
              <div className="text-lg text-text-secondary font-medium">
                {m.kreis || ""} · {fmt(m.population)} EW
              </div>
            </div>
            <Card variant="default" padding="default" className="flex flex-col items-center">
              <div className="text-sm text-text-tertiary mb-1">{t("overallScore")}</div>
              <ScoreRing score={sc.overall} size={100} stroke={10} />
              <div className="mt-2 font-semibold text-sm text-text-secondary">
                {sc.completeness !== undefined ? `${sc.completeness}%` : "-"} {t("dataCompleteness")}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <div className="lg:col-span-2">
          <MunicipalityMap municipality={m} height="360px" />
        </div>
        <div className="space-y-5">
          <Card variant="flat">
            <div className="flex items-center gap-2.5 mb-4">
              <Activity className="w-5 h-5 text-brand-600" />
              <h3 className="text-h4 font-display text-text-primary">
                {t("municipalProfile")}
              </h3>
            </div>
            <div className="space-y-2.5 text-sm">
              {BENCHMARK_DATA.profileIndicators.map((pi) => {
                const pv =
                  BENCHMARK_DATA.values &&
                  BENCHMARK_DATA.values[m.id] &&
                  BENCHMARK_DATA.values[m.id].profile
                    ? BENCHMARK_DATA.values[m.id].profile[pi.id]
                    : null;
                return (
                  <div key={pi.id} className="flex justify-between py-1 border-b border-border/60 last:border-0">
                    <span className="text-text-tertiary">{pi.name[currentLang]}</span>
                    <span className="font-mono font-medium tabular-nums text-text-primary">
                      {pv && pv.raw !== null && pv.raw !== undefined
                        ? `${fmt(pv.raw, pi.unit === "EUR/EW" ? 2 : 1)} ${pv.unit}`
                        : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card variant="flat">
            <div className="flex items-center gap-2.5 mb-4">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <h3 className="text-h4 font-display text-text-primary">
                {t("strengthsWeaknesses")}
              </h3>
            </div>
            {best && (
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success-500" />
                <span className="text-sm text-text-tertiary">{t("strongestKpi")}:</span>
                <span className="font-medium text-success-500">
                  {best.name} {best.score}%
                </span>
              </div>
            )}
            {worst && (
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-danger-500" />
                <span className="text-sm text-text-tertiary">{t("weakestKpi")}:</span>
                <span className="font-medium text-danger-500">
                  {worst.name} {worst.score}%
                </span>
              </div>
            )}
          </Card>

          <div className="flex gap-2">
            <Link to={`/compare`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full" leftIcon={<GitCompare className="w-4 h-4" />}>
                {t("compare")}
              </Button>
            </Link>
            <ExportButtons municipalityIds={[m.id]} stakeholderId={stakeholder} />
          </div>
        </div>
      </div>

      <PageSection
        icon={MapPin}
        title={t("kpiOverview")}
        description={t("kpiOverviewDescription")}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BENCHMARK_DATA.kpis.map((kpi) => {
            const score = sc.kpis ? sc.kpis[kpi.id] : null;
            const v =
              BENCHMARK_DATA.values &&
              BENCHMARK_DATA.values[m.id] &&
              BENCHMARK_DATA.values[m.id][kpi.id]
                ? BENCHMARK_DATA.values[m.id][kpi.id]
                : { sub: {} };
            const isPriority = priorityKpis.includes(kpi.id);

            return (
              <Card key={kpi.id} variant={isPriority ? "highlighted" : "default"} padding="default">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-h4 font-display text-text-primary">{kpi.name[currentLang]}</h3>
                    {isPriority && (
                      <Badge variant="brand" size="sm" className="mt-1.5">
                        {t("focus")}
                      </Badge>
                    )}
                  </div>
                  <TrafficLight score={score} thresholds={kpi.thresholds} showLabel={false} />
                </div>
                <div className="space-y-1 text-sm mb-4">
                  {kpi.subIndicators.map((sub) => {
                    const sv = v.sub[sub.id];
                    const isPrioritySub = prioritySubIds.includes(sub.id);
                    return (
                      <div
                        key={sub.id}
                        className={`flex justify-between py-1 px-1.5 rounded ${
                          isPrioritySub ? "bg-brand-50 dark:bg-brand-50/10" : ""
                        }`}
                      >
                        <span className="text-text-tertiary">{sub.name[currentLang] || sub.name}</span>
                        <span className="font-mono tabular-nums text-text-primary">
                          {sv.raw !== null && sv.raw !== undefined
                            ? `${fmt(sv.raw, 2)} ${sv.unit}`
                            : <span className="text-text-tertiary italic">{t("noData")}</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<FileText className="w-4 h-4" />}
                  onClick={() => setModal({ kpi, municipality: m })}
                >
                  {t("howCalculated")}
                </Button>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <Card variant="subtle" padding="relaxed">
        <div className="flex items-center gap-2.5 mb-5">
          <GitCompare className="w-5 h-5 text-brand-600" />
          <h2 className="text-h3 font-display text-text-primary tracking-tight">
            {t("comparisonWithOthers")}
          </h2>
        </div>
        <div className="space-y-2">
          {BENCHMARK_DATA.kpis.map((kpi) => {
            const sorted = [...BENCHMARK_DATA.municipalities].sort((a, b) => {
              const av =
                scores && scores[a.id] && scores[a.id].kpis ? scores[a.id].kpis[kpi.id] : null;
              const bv =
                scores && scores[b.id] && scores[b.id].kpis ? scores[b.id].kpis[kpi.id] : null;
              return (bv || 0) - (av || 0);
            });
            const rank = sorted.findIndex((x) => x.id === m.id) + 1;
            const score = sc.kpis ? sc.kpis[kpi.id] : null;

            return (
              <div
                key={kpi.id}
                className="flex items-center justify-between p-3 rounded-md bg-surface border border-border/60 hover:border-border transition-colors"
              >
                <span className="font-medium text-text-primary">{kpi.name[currentLang]}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-tertiary">
                    {t("rank")} {rank} / {sorted.length}
                  </span>
                  <span className="font-bold tabular-nums text-text-primary w-12 text-right">
                    {score !== null && score !== undefined ? `${score}%` : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default MunicipalityDetail;
