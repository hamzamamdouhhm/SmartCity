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

// Semantic status colors aligned with the design system
const STATUS_COLORS = {
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  neutral: "#6B7A75",
};

export const statusInfo = (score, thresholds) => {
  if (score === null || score === undefined) {
    return { text: "noData", variant: "neutral", color: STATUS_COLORS.neutral, label: i18n.t("noData") };
  }
  if (score >= thresholds.green) {
    return { text: "excellent", variant: "success", color: STATUS_COLORS.success, label: i18n.t("excellent") };
  }
  if (score >= thresholds.yellow) {
    return { text: "medium", variant: "warning", color: STATUS_COLORS.warning, label: i18n.t("medium") };
  }
  return { text: "weak", variant: "danger", color: STATUS_COLORS.danger, label: i18n.t("weak") };
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
