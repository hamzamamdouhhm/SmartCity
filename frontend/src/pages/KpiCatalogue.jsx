import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, BookOpen } from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import {
  Badge,
  Card,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  Input,
  PageHeader,
  SegmentedControl,
} from "../components/ui";

const KpiCatalogue = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data: BENCHMARK_DATA } = useData();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const cats = BENCHMARK_DATA ? BENCHMARK_DATA.kpis : [];
  const indicatorCatalogue = BENCHMARK_DATA?.indicatorCatalogue;

  const categoryOptions = [
    { value: "all", label: t("all") },
    ...cats.map((cat) => ({ value: cat.id, label: cat.name[currentLang] })),
  ];

  const filtered = useMemo(() => {
    const list = indicatorCatalogue || [];
    return list.filter((ind) => {
      const matchesCategory = filter === "all" || ind.category === filter;
      const term = search.toLowerCase();
      const name = (ind.name[currentLang] || ind.name || "").toLowerCase();
      const desc = (ind.description?.[currentLang] || "").toLowerCase();
      const matchesSearch = !term || name.includes(term) || desc.includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [indicatorCatalogue, filter, search, currentLang]);

  if (!BENCHMARK_DATA) return null;

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={t("kpiCatalogue")}
        description={t("kpiCatalogueDescription")}
      />

      <Card className="mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-info-50 dark:bg-info-50/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-info-600" />
          </div>
          <div>
            <h2 className="text-h4 font-display text-text-primary mb-1">
              {t("methodologyLabel")}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {BENCHMARK_DATA.methodology.normalization[currentLang]}
            </p>
            <p className="text-body-sm text-text-secondary mt-1">
              {t("categoryScoreExplanation")}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <SegmentedControl options={categoryOptions} value={filter} onChange={setFilter} />
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchIndicators")}
            className="pl-9"
          />
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <DataTable>
          <DataTableHead>
            <DataTableHeader>KPI</DataTableHeader>
            <DataTableHeader>{t("category")}</DataTableHeader>
            <DataTableHeader>{t("unit")}</DataTableHeader>
            <DataTableHeader>{t("dataYear")}</DataTableHeader>
            <DataTableHeader>{t("source")}</DataTableHeader>
            <DataTableHeader>{t("direction")}</DataTableHeader>
            <DataTableHeader>{t("weight")}</DataTableHeader>
            <DataTableHeader>{t("formulaReference")}</DataTableHeader>
          </DataTableHead>
          <DataTableBody>
            {filtered.map((ind) => {
              const cat = cats.find((c) => c.id === ind.category);
              const firstValue =
                BENCHMARK_DATA.values &&
                BENCHMARK_DATA.values["landsberg"] &&
                BENCHMARK_DATA.values["landsberg"][ind.category] &&
                BENCHMARK_DATA.values["landsberg"][ind.category].sub &&
                BENCHMARK_DATA.values["landsberg"][ind.category].sub[ind.id];

              return (
                <DataTableRow key={ind.id}>
                  <DataTableCell>
                    <div className="font-semibold text-text-primary">{ind.name[currentLang] || ind.name}</div>
                    <div className="text-caption text-text-tertiary max-w-xs">
                      {ind.description ? ind.description[currentLang] || ind.description : ""}
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                    {cat ? (
                      <Badge variant="default" size="sm">
                        {cat.name[currentLang]}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </DataTableCell>
                  <DataTableCell>
                    <span className="font-mono tabular-nums">{ind.unit}</span>
                  </DataTableCell>
                  <DataTableCell>{firstValue?.date || "-"}</DataTableCell>
                  <DataTableCell>
                    <span className="text-text-tertiary">{ind.source || "-"}</span>
                  </DataTableCell>
                  <DataTableCell>
                    {ind.higherIsBetter ? t("higherIsBetter") : t("lowerIsBetter")}
                  </DataTableCell>
                  <DataTableCell>
                    <span className="font-mono tabular-nums">{fmt(ind.weight * 100, 1)}%</span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className="font-mono text-xs text-text-secondary">{ind.formula}</span>
                  </DataTableCell>
                </DataTableRow>
              );
            })}
          </DataTableBody>
        </DataTable>
      </Card>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-tertiary">
          {t("noIndicatorsFound")}
        </div>
      )}
    </div>
  );
};

export default KpiCatalogue;
