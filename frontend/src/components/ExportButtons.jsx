import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../hooks/useData";
import { exportCSV, exportExcel, exportPDF } from "../utils/exports";

const ExportButtons = ({ municipalityIds, stakeholderId }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data } = useData();
  if (!data) return null;
  const isDe = currentLang === "de";
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => exportPDF(data, municipalityIds, stakeholderId)} className="px-3 py-1.5 rounded-lg bg-low text-white text-sm font-medium hover:bg-low/90">{isDe ? "PDF exportieren" : "Export PDF"}</button>
      <button onClick={() => exportExcel(data, municipalityIds, stakeholderId)} className="px-3 py-1.5 rounded-lg bg-good text-white text-sm font-medium hover:bg-good/90">{isDe ? "Excel exportieren" : "Export Excel"}</button>
      <button onClick={() => exportCSV(data, municipalityIds, stakeholderId)} className="px-3 py-1.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy/90">{isDe ? "CSV exportieren" : "Export CSV"}</button>
    </div>
  );
};

export default ExportButtons;
