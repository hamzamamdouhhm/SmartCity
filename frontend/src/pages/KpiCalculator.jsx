import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CalculatorIcon, ChevronDown, BookOpen, AlertCircle } from "lucide-react";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { CALCULATOR_SECTIONS, CALCULATORS } from "../config/calculator.js";
import { Button, Card, Input, PageHeader, Select } from "../components/ui";

const KpiCalculator = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  const { data: BENCHMARK_DATA } = useData();
  const navigate = useNavigate();

  const [municipalityId, setMunicipalityId] = useState("");
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});
  const [weights, setWeights] = useState({});
  const [expandedSections, setExpandedSections] = useState({ daseinsvorsorge: true });

  if (!BENCHMARK_DATA) return null;

  const selectedMunicipality = municipalityId
    ? BENCHMARK_DATA.municipalities.find((m) => m.id === municipalityId)
    : null;

  const getIndicatorValue = (indicatorId) => {
    if (!selectedMunicipality || !indicatorId) return null;
    const ind =
      BENCHMARK_DATA.values[selectedMunicipality.id] &&
      BENCHMARK_DATA.values[selectedMunicipality.id].indicators
        ? BENCHMARK_DATA.values[selectedMunicipality.id].indicators[indicatorId]
        : null;
    return ind && ind.raw !== undefined && ind.raw !== null ? ind.raw : null;
  };

  const getIndicatorMeta = (indicatorId) => {
    if (!selectedMunicipality || !indicatorId) return null;
    const ind =
      BENCHMARK_DATA.values[selectedMunicipality.id] &&
      BENCHMARK_DATA.values[selectedMunicipality.id].indicators
        ? BENCHMARK_DATA.values[selectedMunicipality.id].indicators[indicatorId]
        : null;
    return ind ? { source: ind.source || "", date: ind.date || "", unit: ind.unit || "" } : null;
  };

  const getMinMax = (indicatorId) => {
    const vals = [];
    BENCHMARK_DATA.municipalities.forEach((m) => {
      const ind =
        BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id].indicators
          ? BENCHMARK_DATA.values[m.id].indicators[indicatorId]
          : null;
      if (ind && ind.raw !== null && ind.raw !== undefined) vals.push(ind.raw);
    });
    if (vals.length === 0) return { min: null, max: null };
    return { min: Math.min(...vals), max: Math.max(...vals) };
  };

  const normalize = (value, min, max, higherIsBetter) => {
    if (value === null || value === undefined || min === null || max === null || min === max) return null;
    let n = higherIsBetter ? (value - min) / (max - min) : (max - value) / (max - min);
    return Math.max(0, Math.min(100, n * 100));
  };

  const unitText = (u) => {
    if (!u) return "";
    return typeof u === "object" ? (u[isDe ? "de" : "en"] || "") : u;
  };

  const parseInput = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const normalized = String(value).replace(/\./g, "").replace(",", ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? NaN : num;
  };

  const handleMunicipalityChange = (mid) => {
    setMunicipalityId(mid);
    setInputs({});
    setResults({});
    setErrors({});
    const initialWeights = {};
    CALCULATORS.forEach((calc) => {
      if (calc.type === "composite") {
        calc.subIndicators.forEach((sub) => {
          initialWeights[`${calc.id}-${sub.id}`] = sub.weight;
        });
      }
    });
    setWeights(initialWeights);
  };

  const handleInputChange = (calcId, inputId, value) => {
    setInputs((prev) => ({ ...prev, [`${calcId}-${inputId}`]: value }));
    setResults((prev) => ({ ...prev, [calcId]: null }));
    setErrors((prev) => ({ ...prev, [calcId]: null }));
  };

  const handleWeightChange = (calcId, subId, value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setWeights((prev) => ({ ...prev, [`${calcId}-${subId}`]: num }));
      setResults((prev) => ({ ...prev, [calcId]: null }));
    }
  };

  const validateAndGetValues = (calc) => {
    const values = {};
    const missing = [];
    const invalid = [];
    const inputList =
      calc.type === "composite"
        ? calc.subIndicators
        : calc.type === "display" || calc.type === "normalized"
        ? [calc.input]
        : calc.inputs;
    for (const input of inputList) {
      const raw = inputs[`${calc.id}-${input.id}`];
      if (raw === "" || raw === null || raw === undefined) {
        missing.push(input.name[isDe ? "de" : "en"]);
        continue;
      }
      const num = parseInput(raw);
      if (isNaN(num)) {
        invalid.push(input.name[isDe ? "de" : "en"]);
        continue;
      }
      if (input.min !== undefined && num < input.min) {
        invalid.push(input.name[isDe ? "de" : "en"]);
        continue;
      }
      values[input.id] = num;
    }
    return { values, missing, invalid };
  };

  const handleCalculate = (calc) => {
    if (!selectedMunicipality) return;
    let { values, missing, invalid } = validateAndGetValues(calc);
    if (missing.length) {
      setErrors((prev) => ({
        ...prev,
        [calc.id]: t("missingValues") + missing.join(", "),
      }));
      setResults((prev) => ({ ...prev, [calc.id]: null }));
      return;
    }
    if (invalid.length) {
      setErrors((prev) => ({
        ...prev,
        [calc.id]: t("invalidValues") + invalid.join(", "),
      }));
      setResults((prev) => ({ ...prev, [calc.id]: null }));
      return;
    }

    let result = null;
    try {
      if (calc.type === "display") {
        const val = values[calc.input.id];
        result = {
          result: val,
          steps: [`${calc.formula[isDe ? "de" : "en"]} = ${fmt(val, 2)} ${unitText(calc.unit)}`],
        };
      } else if (calc.type === "rate" || calc.type === "formula") {
        result = calc.calculate(values, isDe);
      } else if (calc.type === "normalized") {
        const val = values[calc.input.id];
        const { min, max } = getMinMax(calc.input.source);
        const norm = normalize(val, min, max, calc.higherIsBetter);
        const formulaText = calc.higherIsBetter
          ? isDe
            ? "Score = (Wert − Min) / (Max − Min) × 100"
            : "Score = (Value − Min) / (Max − Min) × 100"
          : isDe
          ? "Score = (Max − Wert) / (Max − Min) × 100"
          : "Score = (Max − Value) / (Max − Min) × 100";
        if (norm === null) {
          result = {
            result: null,
            steps: [
              formulaText,
              isDe
                ? "Keine aussagekräftige Normalisierung möglich (Min = Max oder keine Daten)."
                : "No meaningful normalization possible (Min = Max or no data).",
            ],
          };
        } else {
          const subst = calc.higherIsBetter
            ? `= (${fmt(val, 2)} − ${fmt(min, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100`
            : `= (${fmt(max, 2)} − ${fmt(val, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100`;
          result = { result: norm, steps: [formulaText, subst, `= ${fmt(norm, 1)}%`] };
        }
      } else if (calc.type === "composite") {
        const steps = [];
        steps.push(calc.formula[isDe ? "de" : "en"]);
        let totalWeight = 0;
        let totalScore = 0;
        calc.subIndicators.forEach((sub) => {
          const val = values[sub.id];
          const { min, max } = getMinMax(sub.source);
          const norm = normalize(val, min, max, sub.higherIsBetter);
          const weight =
            weights[`${calc.id}-${sub.id}`] !== undefined
              ? weights[`${calc.id}-${sub.id}`]
              : sub.weight;
          if (norm !== null) {
            const formula = sub.higherIsBetter
              ? `${sub.name[isDe ? "de" : "en"]}: (${fmt(val, 2)} − ${fmt(min, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100 = ${fmt(norm, 1)}%`
              : `${sub.name[isDe ? "de" : "en"]}: (${fmt(max, 2)} − ${fmt(val, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100 = ${fmt(norm, 1)}%`;
            steps.push(formula + ` · ${t("weight")} ${fmt(weight * 100, 0)}% = ${fmt(norm * weight, 2)}`);
            totalWeight += weight;
            totalScore += norm * weight;
          } else {
            steps.push(`${sub.name[isDe ? "de" : "en"]}: ${t("noData")}`);
          }
        });
        const final = totalWeight > 0 ? totalScore / totalWeight : null;
        steps.push(
          (t("overallScore") + " = ") +
            (final !== null
              ? `${fmt(totalScore, 2)} / ${fmt(totalWeight, 2)} = ${fmt(final, 1)} Punkte`
              : t("noData"))
        );
        result = { result: final, steps };
      }
    } catch {
      setErrors((prev) => ({ ...prev, [calc.id]: t("invalidValue") }));
      setResults((prev) => ({ ...prev, [calc.id]: null }));
      return;
    }
    setResults((prev) => ({ ...prev, [calc.id]: result }));
    setErrors((prev) => ({ ...prev, [calc.id]: null }));
  };

  const renderOfficialComparison = (calc) => {
    const res = results[calc.id];
    if (!calc.officialComparison || !res || res.result === null || res.result === undefined) return null;
    const official = getIndicatorValue(calc.officialComparison.indicatorId);
    if (official === null || official === undefined)
      return <div className="text-sm text-text-tertiary mt-2">{t("noData")}</div>;
    const diff = res.result - official;
    const absDiff = Math.abs(diff);
    const warn = calc.tolerance !== undefined && absDiff > calc.tolerance;
    return (
      <div className="mt-3 p-3 rounded-md bg-subtle border border-border text-sm">
        <div className="font-semibold text-text-primary mb-1">
          {t("comparisonWithOfficialValue")}
        </div>
        <div className="text-text-secondary">
          {t("officialValue")}: {fmt(official, 2)} {calc.officialComparison.unit}
        </div>
        <div className="text-text-secondary">
          {t("calculatedValue")}: {fmt(res.result, 2)} {unitText(calc.unit)}
        </div>
        <div className="text-text-secondary">
          {t("difference")}: {fmt(absDiff, 2)}{" "}
          {unitText(calc.unit) === "%" ? t("percentagePoints") : unitText(calc.unit)}
        </div>
        {warn && <div className="text-danger-500 mt-1">{t("toleranceWarning")}</div>}
      </div>
    );
  };

  const goToMethodology = (calc) => {
    const target =
      calc.type === "composite"
        ? calc.subIndicators[0]
          ? BENCHMARK_DATA.kpis.find((k) => k.id === calc.section)
          : null
        : BENCHMARK_DATA.kpis.find((k) => k.id === calc.section);
    if (target) localStorage.setItem("methodologyOpen", target.id);
    navigate("/methodology");
  };

  const renderInput = (calc, input) => {
    const officialValue = input.source ? getIndicatorValue(input.source) : null;
    const meta = input.source ? getIndicatorMeta(input.source) : null;
    const value = inputs[`${calc.id}-${input.id}`] || "";
    const label = `${input.name[currentLang]} ${input.unit ? `(${input.unit})` : ""}`;
    const hint = input.explanation ? input.explanation[currentLang] : "";

    return (
      <div key={input.id} className="mb-3">
        <Input
          type="text"
          label={label}
          hint={hint}
          value={value}
          onChange={(e) => handleInputChange(calc.id, input.id, e.target.value)}
          placeholder={officialValue !== null ? fmt(officialValue, 2) : t("enterManually")}
        />
        {input.source && officialValue !== null && meta && (
          <div className="text-xs text-success-600 mt-1">
            {t("source")}: {meta.source} {meta.date ? `· ${meta.date}` : ""}
          </div>
        )}
        {input.source && officialValue === null && (
          <div className="text-xs text-danger-500 mt-1">
            {t("noData")} · {t("enterManually")}
          </div>
        )}
        {!input.source && <div className="text-xs text-text-tertiary mt-1">{t("enterManually")}</div>}
      </div>
    );
  };

  const renderCalculatorCard = (calc) => {
    const res = results[calc.id];
    const err = errors[calc.id];
    return (
      <Card key={calc.id}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-brand-50 dark:bg-brand-50/10 flex items-center justify-center shrink-0">
            <CalculatorIcon className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-h4 font-display text-text-primary">{calc.name[currentLang]}</h3>
            <p className="text-body-sm text-text-secondary">{calc.description[currentLang]}</p>
          </div>
        </div>

        {calc.info && (
          <div className="mb-4 p-3 rounded-md bg-info-50 text-body-sm text-info-600 dark:bg-info-50/10">
            {calc.info[isDe ? "de" : "en"]}
          </div>
        )}

        <div className="mb-4 p-3 rounded-md bg-subtle border border-border">
          <div className="text-caption text-text-tertiary mb-1 uppercase tracking-wide">
            {t("formulaReference")}
          </div>
          <div className="font-mono text-sm text-text-primary">{calc.formula[currentLang]}</div>
        </div>

        {calc.type === "composite" ? (
          <div className="mb-4">
            <div className="text-caption text-text-tertiary mb-2 uppercase tracking-wide">
              {t("inputValuesAndWeights")}
            </div>
            {calc.subIndicators.map((sub) => (
              <div key={sub.id} className="mb-3">
                {renderInput(calc, {
                  ...sub,
                  explanation: {
                    de: `${sub.name.de} (${sub.unit})`,
                    en: `${sub.name.en} (${sub.unit})`,
                  },
                })}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-tertiary">{t("weight")}:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.05"
                    value={
                      weights[`${calc.id}-${sub.id}`] !== undefined
                        ? weights[`${calc.id}-${sub.id}`]
                        : sub.weight
                    }
                    onChange={(e) => handleWeightChange(calc.id, sub.id, e.target.value)}
                    className="w-20 h-8 border border-border rounded-md px-2 text-sm bg-surface text-text-primary focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : calc.type === "display" || calc.type === "normalized" ? (
          renderInput(calc, calc.input)
        ) : (
          <div className="mb-4">{calc.inputs.map((input) => renderInput(calc, input))}</div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button size="sm" leftIcon={<CalculatorIcon className="w-4 h-4" />} onClick={() => handleCalculate(calc)}>
            {t("calculate")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={() => goToMethodology(calc)}
          >
            {t("explainFormula")}
          </Button>
        </div>

        {err && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-danger-50 text-danger-700 dark:bg-danger-50/10 dark:text-danger-500 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {err}
          </div>
        )}

        {res && (
          <div className="mt-5 space-y-3">
            <div className="p-4 rounded-md bg-brand-50 dark:bg-brand-50/10 border border-brand-100 dark:border-brand-500/20">
              <div className="text-caption text-text-tertiary mb-1 uppercase tracking-wide">{t("result")}</div>
              <div className="text-2xl font-bold font-display text-text-primary">
                {res.result !== null ? fmt(res.result, 2) : t("noData")}{" "}
                {res.result !== null ? unitText(calc.unit) : ""}
              </div>
            </div>
            <div className="p-3 rounded-md bg-subtle border border-border">
              <div className="text-caption text-text-tertiary mb-1 uppercase tracking-wide">
                {t("calculationSteps")}
              </div>
              {res.steps.map((step, idx) => (
                <div key={idx} className="font-mono text-sm text-text-secondary mb-1">
                  {step}
                </div>
              ))}
            </div>
            {renderOfficialComparison(calc)}
          </div>
        )}
      </Card>
    );
  };

  const grouped = {};
  CALCULATOR_SECTIONS.forEach((sec) => (grouped[sec.id] = []));
  CALCULATORS.forEach((calc) => {
    if (grouped[calc.section]) grouped[calc.section].push(calc);
  });

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={t("calculator")}
        description={
          isDe
            ? "Berechnen Sie kommunale Kennzahlen selbst, vergleichen Sie mit offiziellen Werten und testen Sie verschiedene Szenarien."
            : "Calculate municipal KPIs yourself, compare with official values, and test different scenarios."
        }
      />

      <div className="mb-8 max-w-md">
        <Select value={municipalityId} onChange={(e) => handleMunicipalityChange(e.target.value)}>
          <option value="">{t("selectMunicipality")}</option>
          {BENCHMARK_DATA.municipalities.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name[currentLang]}
            </option>
          ))}
        </Select>
      </div>

      {!selectedMunicipality && (
        <div className="text-text-tertiary">{t("selectMunicipalityPrompt")}</div>
      )}

      {selectedMunicipality &&
        CALCULATOR_SECTIONS.map((sec) => {
          const isDasein = sec.id === "daseinsvorsorge";
          const isExpanded = expandedSections[sec.id] !== false;
          return (
            <div key={sec.id} className="mb-8">
              <button
                onClick={() => isDasein && setExpandedSections((prev) => ({ ...prev, [sec.id]: !isExpanded }))}
                className={`w-full flex items-center justify-between p-4 rounded-lg text-left transition-colors ${
                  isDasein
                    ? "bg-surface border border-border shadow-md hover:bg-subtle/50"
                    : ""
                }`}
              >
                <span className="text-h4 font-display text-text-primary">{sec.name[currentLang]}</span>
                {isDasein && (
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                )}
              </button>
              {(!isDasein || isExpanded) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {grouped[sec.id].map((calc) => renderCalculatorCard(calc))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default KpiCalculator;
