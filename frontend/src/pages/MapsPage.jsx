import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";
import MunicipalityMap from "../components/maps/MunicipalityMap";

const MapsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-6">{t("maps")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BENCHMARK_DATA.municipalities.map(m => {
          if (!m || !m.id) return null;
          return (
            <Link key={m.id} to={`/municipality/${m.id}`} className="block bg-white rounded-2xl p-4 card-shadow border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
                <h3 className="font-bold text-ink">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</h3>
              </div>
              <MunicipalityMap municipality={m} height="250px" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MapsPage;
