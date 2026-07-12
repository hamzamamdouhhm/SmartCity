import React from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import { Card, PageHeader } from "../components/ui";

const DataPage = () => {
  const { t } = useTranslation();
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={t("data")}
        description={t("dataPageDescription")}
      />

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-md bg-info-50 dark:bg-info-50/10 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-info-600" />
          </div>
          <div className="flex-1">
            <p className="text-body text-text-secondary mb-5">
              {t("dataPageUploadHint")}
            </p>
            <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:bg-subtle/50 transition-colors cursor-pointer">
              <UploadCloud className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
              <div className="font-medium text-text-primary">
                {t("dropCsvFileHere")}
              </div>
              <div className="text-sm text-text-tertiary mt-1">
                {t("csvUploadMunicipalityHint")}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataPage;
