import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import { useData } from "../hooks/useData";
import { getLocalized } from "../utils/formatting";
import ScoreRing from "../components/ScoreRing";
import { Card, PageHeader, EmptyState } from "../components/ui";

const MunicipalitiesPage = ({ scores }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();

  if (!BENCHMARK_DATA) {
    return (
      <EmptyState
        icon={MapPin}
        title={t("noData")}
        description={t("loadingMunicipalityData")}
      />
    );
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader title={t("municipalities")} icon={Building2} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BENCHMARK_DATA.municipalities.map((m) => {
          if (!m || !m.id) return null;
          const ov = scores && scores[m.id] ? scores[m.id].overall : null;
          const name = getLocalized(m.name, currentLang) || m.id;

          return (
            <Link key={m.id} to={`/municipality/${m.id}`} className="block group">
              <Card variant="interactive" className="flex items-center gap-5 h-full">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-text-inverse font-bold text-2xl shrink-0"
                  style={{ background: m.color || "hsl(var(--color-brand-600))" }}
                >
                  {name[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-h4 font-display text-text-primary mb-1 group-hover:text-brand-600 transition-colors">
                    {name}
                  </h3>
                  <div className="text-body-sm text-text-tertiary mb-1">{m.kreis || ""}</div>
                  <p className="text-caption text-text-tertiary line-clamp-2">
                    {getLocalized(m.description, currentLang)}
                  </p>
                </div>
                <ScoreRing score={ov} size={60} stroke={5} />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MunicipalitiesPage;
