import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { CALCULATOR_SECTIONS, CALCULATORS } from "../config/calculator.js";

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

  if (!BENCHMARK_DATA) return <div className="text-center py-20">{t("noData")}</div>;

  const selectedMunicipality = municipalityId ? BENCHMARK_DATA.municipalities.find(m => m.id === municipalityId) : null;

  const getIndicatorValue = (indicatorId) => {
    if (!selectedMunicipality || !indicatorId) return null;
    const ind = BENCHMARK_DATA.values[selectedMunicipality.id] && BENCHMARK_DATA.values[selectedMunicipality.id].indicators ? BENCHMARK_DATA.values[selectedMunicipality.id].indicators[indicatorId] : null;
    return ind && ind.raw !== undefined && ind.raw !== null ? ind.raw : null;
  };

  const getIndicatorMeta = (indicatorId) => {
    if (!selectedMunicipality || !indicatorId) return null;
    const ind = BENCHMARK_DATA.values[selectedMunicipality.id] && BENCHMARK_DATA.values[selectedMunicipality.id].indicators ? BENCHMARK_DATA.values[selectedMunicipality.id].indicators[indicatorId] : null;
    return ind ? { source: ind.source || "", date: ind.date || "", unit: ind.unit || "" } : null;
  };

  const getMinMax = (indicatorId) => {
    const vals = [];
    BENCHMARK_DATA.municipalities.forEach(m => {
      const ind = BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id].indicators ? BENCHMARK_DATA.values[m.id].indicators[indicatorId] : null;
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
    CALCULATORS.forEach(calc => {
      if (calc.type === "composite") {
        calc.subIndicators.forEach(sub => { initialWeights[`${calc.id}-${sub.id}`] = sub.weight; });
      }
    });
    setWeights(initialWeights);
  };

  const handleInputChange = (calcId, inputId, value) => {
    setInputs(prev => ({ ...prev, [`${calcId}-${inputId}`]: value }));
    setResults(prev => ({ ...prev, [calcId]: null }));
    setErrors(prev => ({ ...prev, [calcId]: null }));
  };

  const handleWeightChange = (calcId, subId, value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setWeights(prev => ({ ...prev, [`${calcId}-${subId}`]: num }));
      setResults(prev => ({ ...prev, [calcId]: null }));
    }
  };

  const validateAndGetValues = (calc) => {
    const values = {};
    const missing = [];
    const invalid = [];
    const inputList = calc.type === "composite" ? calc.subIndicators : (calc.type === "display" || calc.type === "normalized" ? [calc.input] : calc.inputs);
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
      setErrors(prev => ({ ...prev, [calc.id]: (isDe ? "Folgende Werte fehlen: " : "Missing values: ") + missing.join(", ") }));
      setResults(prev => ({ ...prev, [calc.id]: null }));
      return;
    }
    if (invalid.length) {
      setErrors(prev => ({ ...prev, [calc.id]: (isDe ? "Ungültige Werte: " : "Invalid values: ") + invalid.join(", ") }));
      setResults(prev => ({ ...prev, [calc.id]: null }));
      return;
    }

    let result = null;
    try {
      if (calc.type === "display") {
        const val = values[calc.input.id];
        result = { result: val, steps: [`${calc.formula[isDe ? "de" : "en"]} = ${fmt(val, 2)} ${unitText(calc.unit)}`] };
      } else if (calc.type === "rate" || calc.type === "formula") {
        result = calc.calculate(values, isDe);
      } else if (calc.type === "normalized") {
        const val = values[calc.input.id];
        const { min, max } = getMinMax(calc.input.source);
        const norm = normalize(val, min, max, calc.higherIsBetter);
        const formulaText = calc.higherIsBetter
          ? (isDe ? "Score = (Wert − Min) / (Max − Min) × 100" : "Score = (Value − Min) / (Max − Min) × 100")
          : (isDe ? "Score = (Max − Wert) / (Max − Min) × 100" : "Score = (Max − Value) / (Max − Min) × 100");
        if (norm === null) {
          result = { result: null, steps: [formulaText, isDe ? "Keine aussagekräftige Normalisierung möglich (Min = Max oder keine Daten)." : "No meaningful normalization possible (Min = Max or no data)."] };
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
        calc.subIndicators.forEach(sub => {
          const val = values[sub.id];
          const { min, max } = getMinMax(sub.source);
          const norm = normalize(val, min, max, sub.higherIsBetter);
          const weight = weights[`${calc.id}-${sub.id}`] !== undefined ? weights[`${calc.id}-${sub.id}`] : sub.weight;
          if (norm !== null) {
            const formula = sub.higherIsBetter
              ? `${sub.name[isDe ? "de" : "en"]}: (${fmt(val, 2)} − ${fmt(min, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100 = ${fmt(norm, 1)}%`
              : `${sub.name[isDe ? "de" : "en"]}: (${fmt(max, 2)} − ${fmt(val, 2)}) / (${fmt(max, 2)} − ${fmt(min, 2)}) × 100 = ${fmt(norm, 1)}%`;
            steps.push(formula + ` · Gewicht ${fmt(weight * 100, 0)}% = ${fmt(norm * weight, 2)}`);
            totalWeight += weight;
            totalScore += norm * weight;
          } else {
            steps.push(`${sub.name[isDe ? "de" : "en"]}: ${t("noData")}`);
          }
        });
        const final = totalWeight > 0 ? totalScore / totalWeight : null;
        steps.push((isDe ? "Gesamtscore = " : "Overall score = ") + (final !== null ? `${fmt(totalScore, 2)} / ${fmt(totalWeight, 2)} = ${fmt(final, 1)} Punkte` : t("noData")));
        result = { result: final, steps };
      }
    } catch {
      setErrors(prev => ({ ...prev, [calc.id]: t("invalidValue") }));
      setResults(prev => ({ ...prev, [calc.id]: null }));
      return;
    }
    setResults(prev => ({ ...prev, [calc.id]: result }));
    setErrors(prev => ({ ...prev, [calc.id]: null }));
  };

  const renderOfficialComparison = (calc) => {
    const res = results[calc.id];
    if (!calc.officialComparison || !res || res.result === null || res.result === undefined) return null;
    const official = getIndicatorValue(calc.officialComparison.indicatorId);
    if (official === null || official === undefined) return <div className="text-sm text-muted mt-2">{t("noData")}</div>;
    const diff = res.result - official;
    const absDiff = Math.abs(diff);
    const warn = calc.tolerance !== undefined && absDiff > calc.tolerance;
    return (
      <div className="mt-3 p-3 rounded-lg bg-paper border border-gray-100 text-sm">
        <div className="font-semibold mb-1">{isDe ? "Vergleich mit offiziellem Wert" : "Comparison with official value"}</div>
        <div>{t("officialValue")}: {fmt(official, 2)} {calc.officialComparison.unit}</div>
        <div>{t("calculatedValue")}: {fmt(res.result, 2)} {unitText(calc.unit)}</div>
        <div>{t("difference")}: {fmt(absDiff, 2)} {unitText(calc.unit) === "%" ? t("percentagePoints") : unitText(calc.unit)}</div>
        {warn && <div className="text-low mt-1">{t("toleranceWarning")}</div>}
      </div>
    );
  };

  const goToMethodology = (calc) => {
    const target = calc.type === "composite" ? (calc.subIndicators[0] ? BENCHMARK_DATA.kpis.find(k => k.id === calc.section) : null) : BENCHMARK_DATA.kpis.find(k => k.id === calc.section);
    if (target) localStorage.setItem("methodologyOpen", target.id);
    navigate("/methodology");
  };

  const renderInput = (calc, input) => {
    const officialValue = input.source ? getIndicatorValue(input.source) : null;
    const meta = input.source ? getIndicatorMeta(input.source) : null;
    const value = inputs[`${calc.id}-${input.id}`] || "";
    return (
      <div key={input.id} className="mb-3">
        <label className="block text-sm font-medium mb-1">{input.name[currentLang]} {input.unit ? `(${input.unit})` : ""}</label>
        <input type="text" value={value} onChange={e=>handleInputChange(calc.id, input.id, e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" placeholder={officialValue !== null ? fmt(officialValue, 2) : t("enterManually")} />
        <div className="text-xs text-muted mt-1">{input.explanation ? input.explanation[currentLang] : ""}</div>
        {input.source && officialValue !== null && meta && <div className="text-xs text-forest mt-1">{t("source")}: {meta.source} {meta.date ? "· " + meta.date : ""}</div>}
        {input.source && officialValue === null && <div className="text-xs text-low mt-1">{t("noData")} · {t("enterManually")}</div>}
        {!input.source && <div className="text-xs text-muted mt-1">{t("enterManually")}</div>}
      </div>
    );
  };

  const renderCalculatorCard = (calc) => {
    const res = results[calc.id];
    const err = errors[calc.id];
    return (
      <div key={calc.id} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
        <h3 className="font-bold text-ink text-lg mb-1">{calc.name[currentLang]}</h3>
        <p className="text-sm text-gray-600 mb-3">{calc.description[currentLang]}</p>
        {calc.info && <div className="mb-3 p-2 rounded-lg bg-blue-50 text-xs text-blue-900">{calc.info[isDe ? "de" : "en"]}</div>}
        <div className="mb-3 p-3 rounded-lg bg-paper border border-gray-100">
          <div className="text-xs text-muted mb-1">{isDe ? "Formel" : "Formula"}</div>
          <div className="font-mono text-sm">{calc.formula[currentLang]}</div>
        </div>
        {calc.type === "composite" ? (
          <div className="mb-3">
            <div className="text-xs text-muted mb-1">{t("inputValues")} & {isDe ? "Gewichte" : "Weights"}</div>
            {calc.subIndicators.map(sub => (
              <div key={sub.id} className="mb-2">
                {renderInput(calc, { ...sub, explanation: { de: `${sub.name.de} (${sub.unit})`, en: `${sub.name.en} (${sub.unit})` } })}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{isDe ? "Gewicht" : "Weight"}:</span>
                  <input type="number" min="0" step="0.05" value={weights[`${calc.id}-${sub.id}`] !== undefined ? weights[`${calc.id}-${sub.id}`] : sub.weight} onChange={e=>handleWeightChange(calc.id, sub.id, e.target.value)} className="w-20 border border-gray-300 rounded p-1 text-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : calc.type === "display" || calc.type === "normalized" ? (
          renderInput(calc, calc.input)
        ) : (
          <div className="mb-3">{calc.inputs.map(input => renderInput(calc, input))}</div>
        )}
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>handleCalculate(calc)} className="px-3 py-1.5 bg-forest text-white text-sm rounded-lg hover:bg-forest/90">{t("calculate")}</button>
          <button onClick={()=>goToMethodology(calc)} className="px-3 py-1.5 text-forest bg-forest/5 text-sm rounded-lg hover:bg-forest/10">{isDe ? "Formel erklären" : "Explain formula"}</button>
        </div>
        {err && <div className="mt-3 text-low text-sm">{err}</div>}
        {res && (
          <div className="mt-4">
            <div className="p-3 rounded-lg bg-paper border border-gray-100 mb-3">
              <div className="text-xs text-muted mb-1">{t("result")}</div>
              <div className="text-xl font-bold text-ink">{res.result !== null ? fmt(res.result, 2) : t("noData")} {res.result !== null ? unitText(calc.unit) : ""}</div>
            </div>
            <div className="p-3 rounded-lg bg-paper border border-gray-100 mb-3">
              <div className="text-xs text-muted mb-1">{t("calculationSteps")}</div>
              {res.steps.map((step, idx) => <div key={idx} className="font-mono text-sm mb-1">{step}</div>)}
            </div>
            {renderOfficialComparison(calc)}
          </div>
        )}
      </div>
    );
  };

  const grouped = {};
  CALCULATOR_SECTIONS.forEach(sec => grouped[sec.id] = []);
  CALCULATORS.forEach(calc => { if (grouped[calc.section]) grouped[calc.section].push(calc); });

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink mb-2">{t("calculator")}</h1>
      <p className="text-gray-600 mb-6">{isDe ? "Berechnen Sie kommunale Kennzahlen selbst, vergleichen Sie mit offiziellen Werten und testen Sie verschiedene Szenarien." : "Calculate municipal KPIs yourself, compare with official values, and test different scenarios."}</p>
      <div className="mb-6 max-w-md">
        <label className="block text-sm font-medium mb-1">{t("selectMunicipality")}</label>
        <select value={municipalityId} onChange={e=>handleMunicipalityChange(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2">
          <option value="">{isDe ? "Bitte wählen" : "Please select"}</option>
          {BENCHMARK_DATA.municipalities.map(m => <option key={m.id} value={m.id}>{m.name[currentLang]}</option>)}
        </select>
      </div>
      {!selectedMunicipality && <div className="text-muted">{isDe ? "Bitte wählen Sie eine Kommune aus." : "Please select a municipality."}</div>}
      {selectedMunicipality && CALCULATOR_SECTIONS.map(sec => {
        const isDasein = sec.id === "daseinsvorsorge";
        const isExpanded = expandedSections[sec.id] !== false;
        return (
          <div key={sec.id} className="mb-6">
            <button onClick={()=>isDasein && setExpandedSections(prev => ({ ...prev, [sec.id]: !isExpanded }))} className={`w-full flex items-center justify-between p-4 rounded-xl text-left font-bold text-ink ${isDasein ? "bg-white card-shadow border border-gray-100 hover:bg-gray-50" : ""}`}>
              <span>{sec.name[currentLang]}</span>
              {isDasein && <span className="text-xl text-gray-400">{isExpanded ? "−" : "+"}</span>}
            </button>
            {(!isDasein || isExpanded) && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                {grouped[sec.id].map(calc => renderCalculatorCard(calc))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KpiCalculator;
