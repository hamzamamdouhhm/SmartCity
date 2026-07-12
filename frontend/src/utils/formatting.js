import i18n from "../i18n";

export const fmt = (v, dec = 0) => {
  if (v === null || v === undefined || isNaN(v)) return "-";
  const opts = { minimumFractionDigits: dec, maximumFractionDigits: dec };
  return Number(v).toLocaleString(i18n.language === "de" ? "de-DE" : "en-US", opts);
};

export const round = (v, dec = 0) => {
  if (v === null || v === undefined || isNaN(v)) return v;
  const f = Math.pow(10, dec);
  return Math.round(v * f) / f;
};

export const statusInfo = (score, thresholds) => {
  if (score === null || score === undefined) {
    return { text: "noData", color: "#9AA69B", label: i18n.t("noData") };
  }
  if (score >= thresholds.green) {
    return { text: "excellent", color: "#059669", label: i18n.t("excellent") };
  }
  if (score >= thresholds.yellow) {
    return { text: "good", color: "#D97706", label: i18n.t("good") };
  }
  return { text: "weak", color: "#DC2626", label: i18n.t("weak") };
};

export const formatDate = (date) =>
  date.toLocaleDateString(i18n.language === "de" ? "de-DE" : "en-US");

export const getLocalized = (obj, lang, fallback = "de") => {
  if (!obj) return "";
  if (typeof obj !== "object") return String(obj);
  if (obj[lang] !== undefined && obj[lang] !== null) return obj[lang];
  const base = lang && lang.includes("-") ? lang.split("-")[0] : lang;
  if (base && obj[base] !== undefined && obj[base] !== null) return obj[base];
  if (obj[fallback] !== undefined && obj[fallback] !== null) return obj[fallback];
  // Return first non-empty value
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];
  }
  return "";
};
