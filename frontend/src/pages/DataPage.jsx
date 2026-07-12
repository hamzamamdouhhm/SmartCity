import React from "react";
import { useTranslation } from "react-i18next";

const DataPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-4">{t("data")}</h1>
      <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
        <p className="text-gray-700 mb-4">{isDe ? "Rohdaten aus backend/data/csv/. CSV-Import-Assistent ist als UI-Platzhalter vorgesehen." : "Raw data from backend/data/csv/. CSV import wizard is planned as a UI placeholder."}</p>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📁</div>
          <div className="font-medium">{isDe ? "CSV-Datei hier ablegen" : "Drop CSV file here"}</div>
          <div className="text-sm">{isDe ? "nur Südharz, Landsberg, Leuna, Teutschenthal" : "only Südharz, Landsberg, Leuna, Teutschenthal"}</div>
        </div>
      </div>
    </div>
  );
};

export default DataPage;
