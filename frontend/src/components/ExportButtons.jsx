import React from "react";
import { useTranslation } from "react-i18next";
import { FileText, FileSpreadsheet, FileCode } from "lucide-react";
import { useData } from "../hooks/useData";
import { exportCSV, exportExcel, exportPDF } from "../utils/exports";
import { Button } from "./ui";

const ExportButtons = ({ municipalityIds, stakeholderId }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data } = useData();
  if (!data) return null;
  const isDe = currentLang === "de";

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<FileText className="w-4 h-4" />}
        onClick={() => exportPDF(data, municipalityIds, stakeholderId)}
      >
        {isDe ? "PDF" : "PDF"}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<FileSpreadsheet className="w-4 h-4" />}
        onClick={() => exportExcel(data, municipalityIds, stakeholderId)}
      >
        {isDe ? "Excel" : "Excel"}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<FileCode className="w-4 h-4" />}
        onClick={() => exportCSV(data, municipalityIds, stakeholderId)}
      >
        {isDe ? "CSV" : "CSV"}
      </Button>
    </div>
  );
};

export default ExportButtons;
