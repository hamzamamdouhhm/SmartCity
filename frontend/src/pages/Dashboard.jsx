import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Trophy,
  Layers,
  Building2,
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt, round, statusInfo, getLocalized } from "../utils/formatting";
import ScoreRing from "../components/ScoreRing";
import ExportButtons from "../components/ExportButtons";
import { BarChart } from "../components/charts/BarChart";
import { LogoMark } from "../components/Logo";
import { Button, Card, PageSection } from "../components/ui";

const Dashboard = ({ scores, setCategoryModal, stakeholder }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const sorted = useMemo(() => {
    if (!BENCHMARK_DATA) return [];
    return [...BENCHMARK_DATA.municipalities].sort(
      (a, b) =>
        ((scores && scores[b.id] ? scores[b.id].overall : 0) || 0) -
        ((scores && scores[a.id] ? scores[a.id].overall : 0) || 0)
    );
  }, [BENCHMARK_DATA, scores]);

  const chartDatasets = useMemo(() => {
    if (!BENCHMARK_DATA) return [];
    return BENCHMARK_DATA.kpis.map((kpi) => ({
      label: getLocalized(kpi.name, currentLang),
      data: BENCHMARK_DATA.municipalities.map((m) =>
        scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[kpi.id] || 0 : 0
      ),
    }));
  }, [BENCHMARK_DATA, scores, currentLang]);

  if (!BENCHMARK_DATA) return null;

  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section className="hero-saas rounded-xl p-8 md:p-12 lg:p-14 mb-10 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-subtle border border-border text-text-secondary text-label mb-5">
              <LogoMark size={18} />
              <span>{t("dashboardHeroTag")}</span>
            </div>
            <p className="text-label uppercase tracking-widest text-text-tertiary mb-3">
              {t("heroEyebrow")}
            </p>
            <h1 className="text-h1 md:text-[3.25rem] font-display font-bold text-text-primary tracking-tight mb-5">
              {t("appTitle")}
            </h1>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl mb-8">
              {t("appSubtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/municipalities">
                <Button size="md" leftIcon={<Building2 className="w-4 h-4" />}>
                  {t("exploreMunicipalities")}
                </Button>
              </Link>
              <Link to="/ranking">
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t("viewRanking")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:flex relative items-center justify-center">
            {/* soft glow shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-info-500/10 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-2 gap-4 w-full max-w-md">
              {/* Top performer */}
              <Card variant="default" padding="default" className="col-span-2 flex items-center gap-4">
                <ScoreRing
                  score={sorted[0] && scores[sorted[0].id] ? scores[sorted[0].id].overall : null}
                  size={72}
                  stroke={8}
                />
                <div>
                  <div className="text-label uppercase tracking-wider text-text-tertiary mb-0.5">
                    {t("topPerformer")}
                  </div>
                  <div className="text-h4 font-display text-text-primary">
                    {sorted[0] ? getLocalized(sorted[0].name, currentLang) : "-"}
                  </div>
                  <div className="text-body-sm text-text-secondary">
                    {sorted[0] && scores[sorted[0].id] ? `${scores[sorted[0].id].overall}%` : "-"}
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <Card variant="default" padding="default" className="text-center">
                <div className="text-h3 font-display text-text-primary">
                  {BENCHMARK_DATA.municipalities.length}
                </div>
                <div className="text-caption text-text-tertiary">
                  {BENCHMARK_DATA.municipalities.length === 1 ? t("municipality") : t("municipalities")}
                </div>
              </Card>
              <Card variant="default" padding="default" className="text-center">
                <div className="text-h3 font-display text-text-primary">
                  {BENCHMARK_DATA.kpis.reduce((acc, k) => acc + k.subIndicators.length, 0)}
                </div>
                <div className="text-caption text-text-tertiary">
                  {BENCHMARK_DATA.kpis.reduce((acc, k) => acc + k.subIndicators.length, 0) === 1
                    ? t("indicator")
                    : t("indicators")}
                </div>
              </Card>

              {/* Sparkline */}
              <Card variant="default" padding="default" className="col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption text-text-tertiary uppercase tracking-wider">{t("kpiComparison")}</span>
                  <span className="text-caption text-text-tertiary">{BENCHMARK_DATA.config.lastUpdated || "2026"}</span>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {sorted[0] &&
                    BENCHMARK_DATA.kpis.map((kpi) => {
                      const val = scores && scores[sorted[0].id] && scores[sorted[0].id].kpis ? scores[sorted[0].id].kpis[kpi.id] : 0;
                      return (
                        <div key={kpi.id} className="flex-1 flex flex-col items-center gap-1 group">
                          <div
                            className="w-full rounded-sm bg-brand-500/30 group-hover:bg-brand-500/50 transition-colors"
                            style={{ height: `${Math.max(8, val)}%` }}
                            title={`${getLocalized(kpi.name, currentLang)}: ${val}%`}
                          />
                          <span className="text-[10px] text-text-tertiary truncate w-full text-center">
                            {getLocalized(kpi.name, currentLang).substring(0, 3)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* KPI categories */}
      <PageSection
        icon={Layers}
        title={t("categoryScores")}
        description={t("categoryScoresDescription")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {BENCHMARK_DATA.kpis.map((kpi) => {
            const vals = BENCHMARK_DATA.municipalities
              .map((m) => scores[m.id].kpis[kpi.id])
              .filter((s) => s !== null && s !== undefined);
            const avgScore = vals.length ? round(vals.reduce((a, b) => a + b, 0) / vals.length, 1) : null;

            return (
              <Card key={kpi.id} variant="interactive" padding="default" className="group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-md bg-subtle border border-border flex items-center justify-center text-brand-700 dark:text-brand-500 font-bold text-sm">
                    {getLocalized(kpi.name, currentLang).substring(0, 2)}
                  </div>
                  <ScoreRing score={avgScore} size={52} stroke={5} />
                </div>
                <h3 className="text-h4 font-display text-text-primary mb-1 group-hover:text-brand-600 transition-colors">
                  {getLocalized(kpi.name, currentLang)}
                </h3>
                <p className="text-caption text-text-tertiary mb-4 line-clamp-2">
                  {getLocalized(kpi.description, currentLang)}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-caption text-text-tertiary">
                    {t("weight")}: {fmt(kpi.weight * 100, 0)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2"
                    onClick={() => setCategoryModal({ kpi })}
                  >
                    {t("details")}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </PageSection>

      {/* Municipalities */}
      <PageSection
        icon={Building2}
        title={t("municipalities")}
        description={t("municipalitiesDescription")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {BENCHMARK_DATA.municipalities.map((m) => {
            if (!m || !m.id) return null;
            const sc = scores && scores[m.id] ? scores[m.id] : {};
            const kpisArr = BENCHMARK_DATA.kpis.map((k) => ({
              id: k.id,
              name: getLocalized(k.name, currentLang),
              score: sc.kpis ? sc.kpis[k.id] : null,
            }));
            const best = kpisArr
              .filter((k) => k.score !== null && k.score !== undefined)
              .sort((a, b) => b.score - a.score)[0];
            const worst = kpisArr
              .filter((k) => k.score !== null && k.score !== undefined)
              .sort((a, b) => a.score - b.score)[0];

            return (
              <Link key={m.id} to={`/municipality/${m.id}`} className="block group">
                <Card variant="interactive" padding="default" className="h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-text-inverse font-bold shadow-sm"
                      style={{ background: m.color || "hsl(var(--color-brand-600))" }}
                    >
                      {getLocalized(m.name, currentLang)[0] || "?"}
                    </div>
                    <ScoreRing score={sc.overall} size={52} stroke={5} />
                  </div>
                  <h3 className="text-h4 font-display text-text-primary mb-1 group-hover:text-brand-600 transition-colors">
                    {getLocalized(m.name, currentLang) || m.id}
                  </h3>
                  <div className="text-caption text-text-tertiary mb-4">
                    {m.kreis || ""} · {fmt(m.population)} EW
                  </div>
                  <div className="space-y-2 text-sm">
                    {best && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-success-500" />
                        <span className="text-text-tertiary truncate">{best.name}</span>
                      </div>
                    )}
                    {worst && (
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
                        <span className="text-text-tertiary truncate">{worst.name}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageSection>

      {/* Chart + Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <Card variant="elevated" padding="relaxed" className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <h2 className="text-h3 font-display text-text-primary tracking-tight">
              {t("kpiComparison")}
            </h2>
          </div>
          <div className="h-64">
            <BarChart
              labels={BENCHMARK_DATA.municipalities.map((m) => getLocalized(m.name, currentLang))}
              datasets={chartDatasets}
              height={256}
            />
          </div>
        </Card>

        <Card variant="flat" padding="relaxed" className="bg-subtle/50">
          <div className="flex items-center gap-2.5 mb-5">
            <Trophy className="w-5 h-5 text-warning-500" />
            <h2 className="text-h3 font-display text-text-primary tracking-tight">{t("ranking")}</h2>
          </div>
          <ol className="space-y-2">
            {sorted.map((m, i) => {
              if (!m || !m.id) return null;
              const ov = scores && scores[m.id] ? scores[m.id].overall : null;
              const info = statusInfo(ov, BENCHMARK_DATA.config.scoreThresholds);
              const isTop = i === 0;

              return (
                <li key={m.id}>
                  <Link
                    to={`/municipality/${m.id}`}
                    className={`flex items-center justify-between p-2.5 rounded-md transition-all duration-fast ${
                      isTop
                        ? "bg-surface border border-success-200 dark:border-success-500/30 shadow-sm"
                        : "bg-surface/60 hover:bg-surface border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isTop
                            ? "bg-success-500 text-text-inverse"
                            : "bg-subtle text-text-secondary border border-border"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium text-text-primary">
                        {getLocalized(m.name, currentLang) || m.id}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-sm" style={{ color: info.color }}>
                      {ov !== null && ov !== undefined ? `${ov}%` : "-"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <Link to="/ranking">
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t("viewFullRanking")}
            </Button>
          </Link>
        </Card>
      </div>

      {/* Export */}
      <Card variant="subtle" padding="relaxed">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-h3 font-display text-text-primary tracking-tight">
                {t("exportData")}
              </h2>
              <p className="text-body-sm text-text-secondary mt-0.5">
                {t("exportDataDescription")}
              </p>
            </div>
          </div>
          <ExportButtons
            municipalityIds={BENCHMARK_DATA.municipalities.map((m) => m.id)}
            stakeholderId={stakeholder}
          />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
