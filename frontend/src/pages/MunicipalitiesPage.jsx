import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import ScoreRing from "../components/ScoreRing";

const MunicipalitiesPage = ({ scores }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-6">{t("municipalities")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BENCHMARK_DATA.municipalities.map(m => {
          if (!m || !m.id) return null;
          const ov = scores && scores[m.id] ? scores[m.id].overall : null;
          return (
            <Link key={m.id} to={`/municipality/${m.id}`} className="flex items-center gap-4 bg-white rounded-2xl p-5 card-shadow border border-gray-100 hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
              <div className="flex-1">
                <h3 className="font-bold text-ink text-lg">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</h3>
                <div className="text-sm text-muted mb-1">{m.kreis || ""}</div>
                <div className="text-sm text-gray-600">{m.description && m.description[currentLang] ? m.description[currentLang] : ""}</div>
              </div>
              <ScoreRing score={ov} size={60} stroke={5} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MunicipalitiesPage;
