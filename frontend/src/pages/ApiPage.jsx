import React from "react";
import { useTranslation } from "react-i18next";

const ApiPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-4">{t("api")}</h1>
      <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 font-mono text-sm">
        <p className="text-gray-700 mb-2 font-sans">{isDe ? "Verfügbare Endpunkte:" : "Available endpoints:"}</p>
        <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto whitespace-pre">
          {`GET /api/benchmark\n{\n  config: { ... },\n  municipalities: [...],\n  kpis: [...],\n  profileIndicators: [...],\n  stakeholders: { ... },\n  values: { ... }\n}`}
        </div>
      </div>
    </div>
  );
};

export default ApiPage;
