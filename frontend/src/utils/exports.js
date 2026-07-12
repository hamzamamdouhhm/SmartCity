import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import i18n from "../i18n";
import { fmt, formatDate } from "./formatting";

const t = (key) => i18n.t(key);

export const getExportRows = (data, municipalityIds, stakeholderId) => {
  const rows = [];
  const stakeholder = data.stakeholders[stakeholderId];
  const now = formatDate(new Date());
  rows.push({ type: "meta", key: i18n.language === "de" ? "Exportdatum" : "Export date", value: now });
  rows.push({ type: "meta", key: i18n.language === "de" ? "Stakeholder-Sicht" : "Stakeholder view", value: stakeholder.name[i18n.language] });
  for (const mid of municipalityIds) {
    const m = data.municipalities.find((x) => x.id === mid);
    rows.push({ type: "municipality", key: i18n.language === "de" ? "Kommune" : "Municipality", value: m.name[i18n.language] });
    for (const kpi of data.kpis) {
      const score = data.values[mid].kpis[kpi.id];
      rows.push({
        type: "kpi",
        key: kpi.name[i18n.language],
        value: score !== null ? score + "%" : "-",
        unit: "%",
        source: kpi.source[i18n.language] || kpi.source,
        year: kpi.lastUpdate
      });
      for (const sub of kpi.subIndicators) {
        const sv = data.values[mid][kpi.id].sub[sub.id];
        rows.push({
          type: "sub",
          key: "  " + (sub.name[i18n.language] || sub.name),
          value: sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) : t("noData"),
          unit: sv.unit,
          source: sv.source,
          year: sv.date,
          normalized: sv.normalized !== null && sv.normalized !== undefined ? sv.normalized + "%" : "-"
        });
      }
    }
    rows.push({ type: "profile", key: i18n.language === "de" ? "Gesamtscore" : "Overall score", value: data.values[mid].overall + "%" });
  }
  return rows;
};

export const exportCSV = (data, municipalityIds, stakeholderId) => {
  const rows = getExportRows(data, municipalityIds, stakeholderId);
  const header = ["Typ", "Kennzahl", "Wert", "Einheit", "Normiert", "Quelle", "Jahr"];
  const lines = [header.join(";")];
  for (const r of rows) {
    lines.push([r.type, r.key, r.value, r.unit || "", r.normalized || "", r.source || "", r.year || ""].join(";"));
  }
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `smartcity-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportExcel = (data, municipalityIds, stakeholderId) => {
  const rows = getExportRows(data, municipalityIds, stakeholderId);
  const wsData = [["Typ", "Kennzahl", "Wert", "Einheit", "Normiert", "Quelle", "Jahr"]];
  for (const r of rows) {
    wsData.push([r.type, r.key, r.value, r.unit || "", r.normalized || "", r.source || "", r.year || ""]);
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Export");
  XLSX.writeFile(wb, `smartcity-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportPDF = (data, municipalityIds, stakeholderId) => {
  const doc = new jsPDF();
  const rows = getExportRows(data, municipalityIds, stakeholderId);
  doc.setFontSize(16);
  doc.text("Smart City Benchmarking", 14, 20);
  doc.setFontSize(10);
  let y = 30;
  for (const r of rows) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const line = `${r.type === "municipality" ? "" : "  "}${r.key}: ${r.value} ${r.unit || ""}${r.normalized ? " (" + r.normalized + ")" : ""}${r.source ? " [" + r.source + "]" : ""}`;
    doc.text(line, r.type === "municipality" ? 14 : 18, y);
    y += 6;
  }
  doc.save(`smartcity-export-${new Date().toISOString().slice(0, 10)}.pdf`);
};
