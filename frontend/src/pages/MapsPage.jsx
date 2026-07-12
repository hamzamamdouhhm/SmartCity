import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useData } from "../hooks/useData";
import { getLocalized } from "../utils/formatting";
import MunicipalityMap from "../components/maps/MunicipalityMap";
import { Card, PageHeader } from "../components/ui";

const MapsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();

  if (!BENCHMARK_DATA) return null;

  return (
    <div className="animate-fade-in-up">
      <PageHeader title={t("maps")} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BENCHMARK_DATA.municipalities.map((m) => {
          if (!m || !m.id) return null;
          const name = getLocalized(m.name, currentLang) || m.id;
          return (
            <Link key={m.id} to={`/municipality/${m.id}`} className="block group">
              <Card variant="interactive" padding="compact">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center text-text-inverse font-bold text-sm"
                    style={{ background: m.color || "hsl(var(--color-brand-600))" }}
                  >
                    {name[0] || "?"}
                  </div>
                  <h3 className="text-h4 font-display text-text-primary group-hover:text-brand-600 transition-colors">
                    {name}
                  </h3>
                  <MapPin className="w-4 h-4 text-text-tertiary ml-auto" />
                </div>
                <MunicipalityMap municipality={m} height="240px" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MapsPage;
