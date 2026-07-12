import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, GitCompare } from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt, getLocalized } from "../utils/formatting";
import TrafficLight from "../components/TrafficLight";
import ExportButtons from "../components/ExportButtons";
import {
  Button,
  Card,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  PageHeader,
  SegmentedControl,
} from "../components/ui";

const Compare = ({ scores, setModal, stakeholder, _setStakeholder }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const [showRaw, setShowRaw] = useState(false);
  const [level, setLevel] = useState("category");

  if (!BENCHMARK_DATA) return null;

  const allIndicators = BENCHMARK_DATA.kpis.flatMap((k) =>
    k.subIndicators.map((sub) => ({
      ...sub,
      categoryId: k.id,
      categoryName: k.name[currentLang],
    }))
  );

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        icon={GitCompare}
        title={t("comparison")}
        description={t("compareDescription")}
        actions={<ExportButtons municipalityIds={BENCHMARK_DATA.municipalities.map((m) => m.id)} stakeholderId={stakeholder} />}
      />

      <div className="flex flex-wrap items-center gap-4 mb-5">
        <SegmentedControl
          options={[
            { value: "category", label: t("categories") },
            { value: "indicator", label: t("individualKpis") },
          ]}
          value={level}
          onChange={setLevel}
        />
        <SegmentedControl
          options={[
            { value: "score", label: t("score") },
            { value: "raw", label: t("rawValue") },
          ]}
          value={showRaw ? "raw" : "score"}
          onChange={(v) => setShowRaw(v === "raw")}
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <DataTable>
          <DataTableHead>
            <DataTableHeader>{t("indicator")}</DataTableHeader>
            {BENCHMARK_DATA.municipalities.map((m) =>
              m && m.id ? (
                <DataTableHeader key={m.id} className="text-center">
                  {getLocalized(m.name, currentLang) || m.id}
                </DataTableHeader>
              ) : null
            )}
          </DataTableHead>
          <DataTableBody>
            {level === "category"
              ? BENCHMARK_DATA.kpis.map((kpi) => (
                  <DataTableRow key={kpi.id}>
                    <DataTableCell>
                      <div className="font-semibold text-text-primary">{kpi.name[currentLang]}</div>
                      <div className="text-caption text-text-tertiary">
                        {fmt(kpi.weight * 100, 0)}% · {kpi.subIndicators.length}{" "}
                        {kpi.subIndicators.length === 1 ? t("indicator") : t("indicators")}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                        className="mt-1 h-auto py-1 px-0"
                        onClick={() => setModal({ kpi, municipality: BENCHMARK_DATA.municipalities[0] })}
                      >
                        {t("howCalculated")}
                      </Button>
                    </DataTableCell>
                    {BENCHMARK_DATA.municipalities.map((m) => {
                      if (!m || !m.id) return null;
                      const score =
                        scores && scores[m.id] && scores[m.id].kpis
                          ? scores[m.id].kpis[kpi.id]
                          : null;
                      return (
                        <DataTableCell key={m.id}>
                          <div className="flex flex-col items-center gap-2">
                            {!showRaw ? (
                              <TrafficLight score={score} thresholds={kpi.thresholds} />
                            ) : (
                              <div className="text-center font-mono font-medium tabular-nums text-text-primary">
                                {score !== null && score !== undefined
                                  ? `${score} ${kpi.unit[currentLang] || ""}`
                                  : <span className="text-text-tertiary italic">{t("noData")}</span>}
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto py-0 px-1 text-caption text-text-tertiary hover:text-brand-600"
                              onClick={() => setModal({ kpi, municipality: m })}
                            >
                              {t("details")}
                            </Button>
                          </div>
                        </DataTableCell>
                      );
                    })}
                  </DataTableRow>
                ))
              : allIndicators.map((ind) => (
                  <DataTableRow key={ind.id}>
                    <DataTableCell>
                      <div className="font-semibold text-text-primary">{ind.name[currentLang] || ind.name}</div>
                      <div className="text-caption text-text-tertiary">
                        {ind.categoryName} · {fmt(ind.weight * 100, 1)}%
                      </div>
                    </DataTableCell>
                    {BENCHMARK_DATA.municipalities.map((m) => {
                      if (!m || !m.id) return null;
                      const sv =
                        scores &&
                        scores[m.id] &&
                        scores[m.id][ind.categoryId] &&
                        scores[m.id][ind.categoryId].sub
                          ? scores[m.id][ind.categoryId].sub[ind.id]
                          : { raw: null, normalized: null, unit: ind.unit };
                      return (
                        <DataTableCell key={m.id}>
                          <div className="flex flex-col items-center gap-1">
                            {!showRaw ? (
                              <TrafficLight
                                score={sv.normalized}
                                thresholds={BENCHMARK_DATA.config.scoreThresholds}
                                size="sm"
                              />
                            ) : (
                              <div className="text-center font-mono font-medium tabular-nums text-text-primary">
                                {sv.raw !== null && sv.raw !== undefined
                                  ? `${fmt(sv.raw, 2)} ${sv.unit}`
                                  : <span className="text-text-tertiary italic">{t("noData")}</span>}
                              </div>
                            )}
                            <div className="text-xs text-text-tertiary tabular-nums">
                              {sv.normalized !== null && sv.normalized !== undefined
                                ? `${fmt(sv.normalized, 1)}%`
                                : "-"}
                            </div>
                          </div>
                        </DataTableCell>
                      );
                    })}
                  </DataTableRow>
                ))}
          </DataTableBody>
        </DataTable>
      </Card>
    </div>
  );
};

export default Compare;
