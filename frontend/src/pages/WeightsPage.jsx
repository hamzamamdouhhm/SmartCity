import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

import { useData } from "../hooks/useData";
import { fmt, round } from "../utils/formatting";
import { Button, Card, PageHeader, Slider } from "../components/ui";

const WeightsPage = ({
  indicatorWeights,
  setIndicatorWeights,
  categoryWeights,
  setCategoryWeights,
  resetWeights,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const totalCategoryWeight = useMemo(() => {
    if (!BENCHMARK_DATA) return 0;
    return BENCHMARK_DATA.kpis.reduce((sum, cat) => {
      const w = categoryWeights[cat.id] !== undefined ? categoryWeights[cat.id] : cat.weight;
      return sum + w;
    }, 0);
  }, [BENCHMARK_DATA, categoryWeights]);

  if (!BENCHMARK_DATA) return null;

  const updateIndWeight = (catId, indId, val) => {
    const v = Math.max(0, Math.min(100, parseFloat(val) || 0));
    setIndicatorWeights((prev) => ({
      ...prev,
      [catId]: { ...(prev[catId] || {}), [indId]: v / 100 },
    }));
  };

  const updateCatWeight = (catId, val) => {
    const v = Math.max(0, Math.min(100, parseFloat(val) || 0));
    setCategoryWeights((prev) => ({ ...prev, [catId]: v / 100 }));
  };

  const isBalanced = Math.abs(totalCategoryWeight - 1) < 0.001;

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={t("categoryWeights")}
        description={t("categoryWeightsHint")}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={resetWeights}>
            {t("reset")}
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-h4 font-display text-text-primary">
              {t("categoryWeights")}
            </h2>
            <p className="text-body-sm text-text-tertiary mt-1">
              {t("categoryWeightsHint")}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isBalanced
              ? "bg-success-50 text-success-600 dark:bg-success-50/10"
              : "bg-warning-50 text-warning-600 dark:bg-warning-50/10"
          }`}>
            {isBalanced ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {fmt(totalCategoryWeight * 100, 0)}%
          </div>
        </div>
        {!isBalanced && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-warning-50 text-warning-700 dark:bg-warning-50/10 dark:text-warning-500 text-sm mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {t("weightsShouldSum100")}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BENCHMARK_DATA.kpis.map((cat) => {
            const value = round(
              ((categoryWeights && categoryWeights[cat.id] !== undefined
                ? categoryWeights[cat.id]
                : cat.weight) * 100),
              0
            );
            return (
              <div key={cat.id} className="p-3 rounded-md bg-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-primary">{cat.name[currentLang]}</span>
                  <span className="w-12 text-right font-mono text-sm tabular-nums text-text-primary">
                    {fmt(value, 0)}%
                  </span>
                </div>
                <Slider
                  value={value}
                  min={0}
                  max={100}
                  onChange={(v) => updateCatWeight(cat.id, v)}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {BENCHMARK_DATA.kpis.map((cat) => (
        <Card key={cat.id} className="mb-6">
          <h2 className="text-h4 font-display text-text-primary mb-5">
            {cat.name[currentLang]} · {t("indicatorWeights")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cat.subIndicators.map((sub) => {
              const value = round(
                ((indicatorWeights &&
                  indicatorWeights[cat.id] &&
                  indicatorWeights[cat.id][sub.id] !== undefined
                  ? indicatorWeights[cat.id][sub.id]
                  : sub.weight) * 100),
                0
              );
              return (
                <div key={sub.id} className="p-3 rounded-md bg-subtle">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">{sub.name[currentLang] || sub.name}</span>
                    <span className="w-12 text-right font-mono text-sm tabular-nums text-text-primary">
                      {fmt(value, 0)}%
                    </span>
                  </div>
                  <Slider
                    value={value}
                    min={0}
                    max={100}
                    onChange={(v) => updateIndWeight(cat.id, sub.id, v)}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WeightsPage;
