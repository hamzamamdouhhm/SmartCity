import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SlidersHorizontal, Medal, Trophy } from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt, getLocalized, statusInfo } from "../utils/formatting";
import { Badge, Button, Card, PageHeader } from "../components/ui";

const rankStyles = {
  0: "bg-warning-100 text-warning-600 border-warning-200 dark:bg-warning-50/10 dark:border-warning-500/30",
  1: "bg-subtle text-text-secondary border-border",
  2: "bg-subtle text-text-secondary border-border",
};

const Ranking = ({ scores, categoryWeights }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  if (!BENCHMARK_DATA) return null;
  const categories = [
    { id: "overall", name: t("overallScore") },
    ...BENCHMARK_DATA.kpis.map((k) => ({ id: k.id, name: k.name[currentLang] })),
  ];

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        icon={Trophy}
        title={t("ranking")}
        description={t("rankingsByOverallAndCategories")}
        actions={
          <Link to="/weights">
            <Button variant="secondary" size="sm" leftIcon={<SlidersHorizontal className="w-4 h-4" />}>
              {t("adjustWeights")}
            </Button>
          </Link>
        }
      />

      <Card className="mb-8">
        <h2 className="text-h4 font-display text-text-primary mb-3">
          {t("activeWeights")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {BENCHMARK_DATA.kpis.map((k) => (
            <Badge key={k.id} variant="default" size="md">
              {k.name[currentLang]}: {" "}
              {fmt((categoryWeights && categoryWeights[k.id] !== undefined ? categoryWeights[k.id] : k.weight) * 100, 0)}%
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const list = [...BENCHMARK_DATA.municipalities].sort((a, b) => {
            const av =
              cat.id === "overall"
                ? scores && scores[a.id]
                  ? scores[a.id].overall
                  : null
                : scores && scores[a.id] && scores[a.id].kpis
                ? scores[a.id].kpis[cat.id]
                : null;
            const bv =
              cat.id === "overall"
                ? scores && scores[b.id]
                  ? scores[b.id].overall
                  : null
                : scores && scores[b.id] && scores[b.id].kpis
                ? scores[b.id].kpis[cat.id]
                : null;
            return (bv || 0) - (av || 0);
          });

          return (
            <Card key={cat.id}>
              <div className="flex items-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-brand-600" />
                <h3 className="text-h4 font-display text-text-primary">{cat.name}</h3>
              </div>
              <ol className="space-y-2">
                {list.map((m, i) => {
                  if (!m || !m.id) return null;
                  const score =
                    cat.id === "overall"
                      ? scores && scores[m.id]
                        ? scores[m.id].overall
                        : null
                      : scores && scores[m.id] && scores[m.id].kpis
                      ? scores[m.id].kpis[cat.id]
                      : null;
                  const info = statusInfo(score, BENCHMARK_DATA.config.scoreThresholds);
                  const rankClass = rankStyles[i] || "bg-subtle text-text-secondary border-border";

                  return (
                    <li key={m.id}>
                      <Link
                        to={`/municipality/${m.id}`}
                        className="flex items-center justify-between p-2.5 rounded-md bg-subtle hover:bg-subtle/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center font-bold ${rankClass}`}
                          >
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-text-primary">
                            {getLocalized(m.name, currentLang) || m.id}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: info.color }}
                        >
                          {score !== null && score !== undefined ? `${score}%` : "-"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Ranking;
