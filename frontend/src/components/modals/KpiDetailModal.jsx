import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../../hooks/useData";
import { fmt, getLocalized, statusInfo } from "../../utils/formatting";
import ScoreRing from "../ScoreRing";
import {
  Modal,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "../ui";

const KpiDetailModal = ({ kpi, municipality, onClose, scores }) => {
  const { i18n, t } = useTranslation();
  const { data } = useData();

  if (!kpi || !municipality || !data) return null;

  const v = data.values[municipality.id][kpi.id];
  const score = scores[municipality.id].kpis[kpi.id];
  const lang = i18n.language?.startsWith("en") ? "en" : "de";

  const calcSubs = kpi.subIndicators.map((sub) => {
    const sv = v.sub[sub.id];
    const allRaw = data.municipalities
      .map((m) => {
        const val =
          data.values[m.id] &&
          data.values[m.id][kpi.id] &&
          data.values[m.id][kpi.id].sub
            ? data.values[m.id][kpi.id].sub[sub.id].raw
            : null;
        return val;
      })
      .filter((r) => r !== null && r !== undefined);
    const min = allRaw.length ? Math.min(...allRaw) : null;
    const max = allRaw.length ? Math.max(...allRaw) : null;
    let norm = null;
    let weighted = null;
    if (sv.raw !== null && sv.raw !== undefined && min !== null && max !== null && min !== max) {
      norm = sub.higherIsBetter
        ? ((sv.raw - min) / (max - min)) * 100
        : ((max - sv.raw) / (max - min)) * 100;
      weighted = norm * sub.weight;
    }
    return { sub, sv, min, max, norm, weighted };
  });

  const totalWeight = calcSubs.reduce((sum, s) => (s.norm !== null ? sum + s.sub.weight : sum), 0);
  const totalWeighted = calcSubs.reduce(
    (sum, s) => (s.weighted !== null ? sum + s.weighted : sum),
    0
  );

  return (
    <Modal
      isOpen={!!kpi}
      onClose={onClose}
      title={kpi.name[lang]}
      description={getLocalized(municipality.name, lang)}
      size="lg"
    >
      <div className="mb-5 p-4 rounded-md bg-subtle border border-border">
        <div className="text-caption text-text-tertiary mb-1 uppercase tracking-wide">
          {t("overallScore")}
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing score={score} size={72} stroke={8} />
          <div className="text-lg font-semibold text-text-primary">
            {score !== null ? statusInfo(score, kpi.thresholds).label : "-"}
          </div>
        </div>
      </div>

      <p className="text-body text-text-secondary mb-5">{kpi.description[lang]}</p>

      <div className="mb-5">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          {t("formulaReference")}
        </h3>
        <div className="font-mono text-sm bg-surface border border-border p-3 rounded-md overflow-x-auto text-text-primary">
          {kpi.formula}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          {t("calculation")}
        </h3>
        <div className="font-mono text-sm bg-surface border border-border p-4 rounded-md overflow-x-auto text-text-secondary space-y-2">
          {calcSubs.map(({ sub, sv, min, max, norm, weighted }, idx) => {
            if (sv.raw === null || sv.raw === undefined || min === null || max === null || min === max) {
              return (
                <div
                  key={sub.id}
                  className={idx > 0 ? "pt-2 border-t border-border" : ""}
                >
                  {sub.name[lang] || sub.name}: {t("noCalculationPossible")}
                </div>
              );
            }
            const formulaText = sub.higherIsBetter
              ? t("normalizationFormulaHigher")
              : t("normalizationFormulaLower");
            const substText = sub.higherIsBetter
              ? `(${fmt(sv.raw, 2)} − ${fmt(min, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100 = ${fmt(norm, 1)}%`
              : `(${fmt(max, 2)} − ${fmt(sv.raw, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100 = ${fmt(norm, 1)}%`;
            return (
              <div key={sub.id} className={idx > 0 ? "pt-2 border-t border-border" : ""}>
                <div className="font-semibold text-text-primary">{sub.name[lang] || sub.name}</div>
                <div className="pl-2">
                  {t("normalization")}: {formulaText}
                </div>
                <div className="pl-2">{substText}</div>
                <div className="pl-2">
                  {t("weightedContribution")}: {fmt(norm, 1)}% ×{" "}
                  {fmt(sub.weight * 100, 0)}% = {fmt(weighted, 2)}
                </div>
              </div>
            );
          })}
          <div className="pt-2 border-t border-border-strong font-semibold text-text-primary">
            {t("categoryScore")} ={" "}
            {totalWeighted > 0
              ? `${fmt(totalWeighted, 2)} / ${fmt(totalWeight, 2)} = ${fmt(score, 1)}`
              : t("notCalculable")}
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-text-primary mb-2">
        {t("rawDataAndSources")}
      </h3>
      <DataTable className="mb-4">
        <DataTableHead>
          <DataTableHeader>{t("indicator")}</DataTableHeader>
          <DataTableHeader>{t("rawValue")}</DataTableHeader>
          <DataTableHeader>{t("direction")}</DataTableHeader>
          <DataTableHeader>{t("weight")}</DataTableHeader>
          <DataTableHeader>{t("normalized")}</DataTableHeader>
          <DataTableHeader>{t("source")}</DataTableHeader>
          <DataTableHeader>{t("dataYear")}</DataTableHeader>
        </DataTableHead>
        <DataTableBody>
          {kpi.subIndicators.map((sub) => {
            const sv = v.sub[sub.id];
            return (
              <DataTableRow key={sub.id}>
                <DataTableCell>
                  <span className="font-medium text-text-primary">{sub.name[lang] || sub.name}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="font-mono tabular-nums">
                    {sv.raw !== null && sv.raw !== undefined
                      ? `${fmt(sv.raw, 2)} ${sv.unit}`
                      : <span className="text-text-tertiary italic">{t("noData")}</span>}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs">
                    {sub.higherIsBetter ? t("higherIsBetter") : t("lowerIsBetter")}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="font-mono tabular-nums text-text-tertiary">
                    {fmt(sub.weight * 100, 0)}%
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="font-mono tabular-nums">
                    {sv.normalized !== null && sv.normalized !== undefined
                      ? `${sv.normalized}%`
                      : "-"}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-text-tertiary">{sv.source || "-"}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-text-tertiary">{sv.date || "-"}</span>
                </DataTableCell>
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

export default KpiDetailModal;
