import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { Badge, Card, PageHeader } from "../components/ui";

const categoryColorTokens = ["cat-1", "cat-2", "cat-3", "cat-4"];

const Methodology = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!BENCHMARK_DATA) return;
    const saved = localStorage.getItem("methodologyOpen");
    if (saved) {
      const match = BENCHMARK_DATA.kpis.find((k) => k.id === saved);
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

  if (!BENCHMARK_DATA) return null;

  const getCategoryColor = (index) =>
    categoryColorTokens[index % categoryColorTokens.length];

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={t("methodology")}
        description={t("methodologyDescription")}
      />

      <div className="space-y-4">
        {BENCHMARK_DATA.kpis.map((kpi, index) => {
          const isOpen = openId === kpi.id;
          const colorToken = getCategoryColor(index);

          return (
            <Card
              key={kpi.id}
              id={`methodology-${kpi.id}`}
              padding="none"
              className="overflow-hidden"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : kpi.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-subtle/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-text-inverse font-bold shadow-sm"
                    style={{ background: `hsl(var(--color-${colorToken}))` }}
                  >
                    {kpi.name[currentLang][0]}
                  </div>
                  <div>
                    <h3 className="text-h4 font-display text-text-primary">{kpi.name[currentLang]}</h3>
                    <div className="text-caption text-text-tertiary">
                      {kpi.source[currentLang] || kpi.source}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-text-tertiary transition-transform duration-base ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-5 border-t border-border bg-subtle/30">
                  <p className="text-body text-text-secondary mb-5">{kpi.description[currentLang]}</p>

                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      {t("mathematicalFormula")}
                    </h4>
                    <div className="font-mono text-sm bg-surface border border-border p-4 rounded-md overflow-x-auto text-text-primary">
                      {kpi.formula}
                    </div>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">
                      {t("subIndicatorsAndWeights")}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {kpi.subIndicators.map((sub) => (
                        <li key={sub.id} className="bg-surface p-3 rounded-md border border-border text-sm">
                          <div className="font-medium text-text-primary">{sub.name[currentLang] || sub.name}</div>
                          <div className="text-caption text-text-tertiary mt-1">
                            {t("weight")}: {fmt(sub.weight * 100, 0)}% ·{" "}
                            {t("unit")}: {sub.unit} ·{" "}
                            {sub.higherIsBetter ? t("higherIsBetter") : t("lowerIsBetter")}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">
                      {t("trafficLightThresholds")}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="success" size="md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t("green")}: ≥{kpi.thresholds.green}%
                      </Badge>
                      <Badge variant="warning" size="md">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {t("yellow")}: {kpi.thresholds.yellow}–{kpi.thresholds.green - 1}%
                      </Badge>
                      <Badge variant="danger" size="md">
                        <XCircle className="w-3.5 h-3.5" />
                        {t("red")}: &lt;{kpi.thresholds.yellow}%
                      </Badge>
                    </div>
                  </div>

                  <div className="text-caption text-text-tertiary">
                    {t("lastUpdate")}: {kpi.lastUpdate}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Methodology;
