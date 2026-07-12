import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../../hooks/useData";
import { fmt, getLocalized } from "../../utils/formatting";
import TrafficLight from "../TrafficLight";
import {
  Modal,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "../ui";

const CategoryDetailModal = ({ kpi, onClose, scores }) => {
  const { i18n, t } = useTranslation();
  const { data } = useData();

  if (!kpi || !data) return null;

  const lang = i18n.language?.startsWith("en") ? "en" : "de";

  const subStats = kpi.subIndicators.map((sub) => {
    const allRaw = data.municipalities
      .map((m) => {
        const sv =
          data.values && data.values[m.id] && data.values[m.id][kpi.id] && data.values[m.id][kpi.id].sub
            ? data.values[m.id][kpi.id].sub[sub.id]
            : { raw: null };
        return sv.raw;
      })
      .filter((r) => r !== null && r !== undefined);
    return {
      sub,
      min: allRaw.length ? Math.min(...allRaw) : null,
      max: allRaw.length ? Math.max(...allRaw) : null,
    };
  });

  return (
    <Modal
      isOpen={!!kpi}
      onClose={onClose}
      title={kpi.name[lang]}
      description={t("comparisonOfAllMunicipalities")}
      size="xl"
    >
      <p className="text-body text-text-secondary mb-5">{kpi.description[lang]}</p>

      <div className="mb-5 p-4 rounded-md bg-subtle border border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          {t("formulaReference")}
        </h3>
        <div className="font-mono text-sm bg-surface border border-border p-3 rounded-md overflow-x-auto text-text-primary mb-4">
          {kpi.formula}
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          {t("normalizationPerIndicator")}
        </h3>
        <div className="font-mono text-sm bg-surface border border-border p-3 rounded-md overflow-x-auto text-text-secondary space-y-1">
          {subStats.map(({ sub, min, max }) => {
            if (min === null || max === null || min === max)
              return (
                <div key={sub.id}>
                  {sub.name[lang] || sub.name}: {t("noVariance")}
                </div>
              );
            const dir = sub.higherIsBetter ? t("higherIsBetter") : t("lowerIsBetter");
            const formula = sub.higherIsBetter ? t("normalizationFormulaHigher") : t("normalizationFormulaLower");
            return (
              <div key={sub.id}>
                {sub.name[lang] || sub.name}: {dir}, Min={fmt(min, 2)}, Max={fmt(max, 2)} - {formula}
              </div>
            );
          })}
        </div>
      </div>

      <DataTable className="mb-4">
        <DataTableHead>
          <DataTableHeader>{t("municipality")}</DataTableHeader>
          <DataTableHeader>{t("totalScore")}</DataTableHeader>
          {kpi.subIndicators.map((sub) => (
            <DataTableHeader key={sub.id}>{sub.name[lang] || sub.name}</DataTableHeader>
          ))}
        </DataTableHead>
        <DataTableBody>
          {data.municipalities.map((m) => {
            const score = scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[kpi.id] : null;
            return (
              <DataTableRow key={m.id}>
                <DataTableCell>
                  <span className="font-medium text-text-primary">
                    {getLocalized(m.name, lang) || m.id}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <TrafficLight score={score} thresholds={kpi.thresholds} />
                </DataTableCell>
                {kpi.subIndicators.map((sub) => {
                  const sv =
                    data.values &&
                    data.values[m.id] &&
                    data.values[m.id][kpi.id] &&
                    data.values[m.id][kpi.id].sub
                      ? data.values[m.id][kpi.id].sub[sub.id]
                      : { raw: null, normalized: null, unit: sub.unit };
                  return (
                    <DataTableCell key={sub.id}>
                      <div className="font-mono tabular-nums text-text-primary">
                        {sv.raw !== null && sv.raw !== undefined
                          ? `${fmt(sv.raw, 2)} ${sv.unit}`
                          : <span className="text-text-tertiary italic">{t("noData")}</span>}
                      </div>
                      <div className="text-xs text-text-tertiary tabular-nums">
                        {sv.normalized !== null && sv.normalized !== undefined
                          ? `${fmt(sv.normalized, 0)}%`
                          : "-"}
                      </div>
                    </DataTableCell>
                  );
                })}
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>

      <div className="text-caption text-text-tertiary">
        {t("kpiDataSource")}
        {kpi.source[lang] || kpi.source} · {t("lastUpdate")}: {kpi.lastUpdate}
      </div>
    </Modal>
  );
};

export default CategoryDetailModal;
