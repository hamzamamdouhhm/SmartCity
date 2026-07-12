# DEPRECATED: This file generated a single monolithic index.html with inline JSX.
# The project now uses a Vite-based React SPA in frontend/.
# It is kept for reference only and is no longer executed on backend startup.
import json
from string import Template
from pathlib import Path

BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "backend" / "data" / "benchmarkData.json"
OUT_HTML = BASE / "index.html"
OUT_STATIC_HTML = BASE / "backend" / "static" / "index.html"

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>Smart City Benchmarking</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            paper: "#F8FAF7",
            card: "#FFFFFF",
            ink: "#0F2E2A",
            navy: "#1A3A4A",
            emerald: "#10B981",
            forest: "#064E3B",
            gold: "#D4A017",
            good: "#059669",
            mid: "#D97706",
            low: "#DC2626",
            muted: "#6B7280"
          },
          fontFamily: {
            display: ["Space Grotesk", "system-ui", "sans-serif"],
            body: ["Inter", "system-ui", "sans-serif"],
            mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
          }
        }
      }
    }
  </script>
  <style>
    body { background: #F8FAF7; color: #0F2E2A; font-family: Inter, system-ui, sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: "Space Grotesk", system-ui, sans-serif; }
    .glass { background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(15,46,42,0.08); }
    .card-shadow { box-shadow: 0 4px 24px -8px rgba(15,46,42,0.12); transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card-shadow:hover { transform: translateY(-3px); box-shadow: 0 12px 32px -10px rgba(15,46,42,0.18); }
    .leaflet-container { border-radius: 0.75rem; z-index: 1; }
    .premium-gradient { background: linear-gradient(135deg, #0F2E2A 0%, #1A3A4A 50%, #064E3B 100%); }
    .hero-pattern { background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px); background-size: 24px 24px; }
    .glass-card { background: rgba(255,255,255,0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.4); }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="err" style="display:none;position:fixed;top:0;left:0;right:0;background:#fee;color:#900;padding:10px;z-index:9999;white-space:pre-wrap;font-family:monospace;font-size:12px"></div>
  <script>window.onerror=function(msg,url,line,col,err){var d=document.getElementById("err");if(d){d.style.display="block";d.textContent="JS ERROR: "+msg+" at "+line+":"+col+"\\n"+(err&&err.stack?err.stack:"");}return false;};</script>

  <script type="text/babel">
    const BENCHMARK_DATA = __DATA__;

    const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

    // --- Custom hash router ---
    const getHashPath = () => (window.location.hash || "#").replace(/^#/, "") || "/";
    const PathContext = createContext("/");
    const ParamsContext = createContext({});
    const useHash = () => {
      const [path, setPath] = useState(getHashPath());
      useEffect(() => {
        const handler = () => setPath(getHashPath());
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
      }, []);
      return path;
    };
    const matchRoute = (pattern, path) => {
      if (pattern === path) return {};
      const pp = pattern.split("/").filter(Boolean);
      const pv = path.split("/").filter(Boolean);
      if (pp.length !== pv.length) return null;
      const params = {};
      for (let i = 0; i < pp.length; i++) {
        if (pp[i].startsWith(":")) params[pp[i].slice(1)] = pv[i];
        else if (pp[i] !== pv[i]) return null;
      }
      return params;
    };
    const Router = ({ children }) => {
      const path = useHash();
      return <PathContext.Provider value={path}>{children}</PathContext.Provider>;
    };
    const Routes = ({ children }) => {
      const path = useContext(PathContext);
      for (const el of React.Children.toArray(children)) {
        const params = matchRoute(el.props.path, path);
        if (params !== null) {
          return <ParamsContext.Provider value={params}>{el.props.element}</ParamsContext.Provider>;
        }
      }
      return null;
    };
    const Route = () => null;
    const Link = ({ to, className, children, ...props }) => (
      <a href={`#${to}`} className={className} {...props}>{children}</a>
    );
    const NavLink = ({ to, className, children }) => {
      const path = useContext(PathContext);
      const isActive = path === to || (to !== "/" && path.startsWith(to + "/"));
      const cn = typeof className === "function" ? className({ isActive }) : className;
      return <a href={`#${to}`} className={cn}>{children}</a>;
    };
    const useParams = () => useContext(ParamsContext);

    // --- i18n ---
    let currentLang = "de";
    const TRANSLATIONS = {
      de: {
        appTitle: "Smart City Benchmarking",
        appSubtitle: "Digitaler Vergleich kommunaler Infrastruktur und Daseinsvorsorge",
        dashboard: "Dashboard", municipalities: "Kommunen", comparison: "Vergleich", ranking: "Ranking", maps: "Karten", calculator: "Kennzahlen-Rechner",
        methodology: "Berechnungsmethoden", data: "Daten", api: "API", ai: "KI", login: "Anmelden", logout: "Abmelden",
        overallScore: "Gesamtscore", strongestKpi: "Stärkste KPI", weakestKpi: "Schwächste KPI", dataCompleteness: "Datenvollständigkeit",
        lastUpdate: "Letztes Update", rawValue: "Rohwert", score: "Score", status: "Status", source: "Quelle",
        noData: "Keine Daten verfügbar", howCalculated: "Wie wird diese Kennzahl berechnet?",
        excellent: "Hervorragend", good: "Gut", medium: "Mittel", weak: "Schwach", veryWeak: "Sehr schwach",
        presentationMode: "Präsentationsmodus", aiDemo: "KI-Demonstration", aiDemoNote: "Dies ist ein Demonstrationsmodus ohne Verbindung zu externen KI-Diensten.",
        export: "Exportieren", formulaReference: "Formelsammlung", stakeholderView: "Stakeholder-Sicht",
        profile: "Profil", csvIndicators: "CSV-Indikatoren", interpretation: "Interpretation",
        exportPdf: "PDF exportieren", exportExcel: "Excel exportieren", exportCsv: "CSV exportieren",
        selectMunicipality: "Kommune auswählen", selectKpi: "Kennzahl auswählen", calculate: "Berechnen",
        calculatedValue: "Berechneter Wert", officialValue: "Offizieller Wert", difference: "Abweichung",
        percentagePoints: "Prozentpunkte", toleranceWarning: "Die Abweichung ist größer als erwartet. Bitte überprüfen Sie die Eingabewerte und die Datengrundlage.",
        missingValue: "Wert fehlt", enterManually: "Bitte manuell eingeben", viewMethodology: "Zur Methodik",
        inputValues: "Eingabewerte", calculationSteps: "Rechenschritte", variableExplanation: "Bedeutung der Variablen",
        dataSource: "Datenquelle", dataYear: "Datenjahr", definition: "Definition", unit: "Einheit",
        result: "Ergebnis", notApplicable: "nicht zutreffend", invalidValue: "Ungültiger Wert", divisionByZero: "Division durch Null ist nicht erlaubt"
      },
      en: {
        appTitle: "Smart City Benchmarking",
        appSubtitle: "Digital comparison of municipal infrastructure and public services",
        dashboard: "Dashboard", municipalities: "Municipalities", comparison: "Comparison", ranking: "Ranking", maps: "Maps", calculator: "KPI Calculator",
        methodology: "Methodology", data: "Data", api: "API", ai: "AI", login: "Login", logout: "Logout",
        overallScore: "Overall Score", strongestKpi: "Strongest KPI", weakestKpi: "Weakest KPI", dataCompleteness: "Data Completeness",
        lastUpdate: "Last Update", rawValue: "Raw Value", score: "Score", status: "Status", source: "Source",
        noData: "No data available", howCalculated: "How is this KPI calculated?",
        excellent: "Excellent", good: "Good", medium: "Medium", weak: "Weak", veryWeak: "Very weak",
        presentationMode: "Presentation Mode", aiDemo: "AI Demo", aiDemoNote: "This is a demo mode without connection to external AI services.",
        export: "Export", formulaReference: "Formula Reference", stakeholderView: "Stakeholder View",
        profile: "Profile", csvIndicators: "CSV Indicators", interpretation: "Interpretation",
        exportPdf: "Export PDF", exportExcel: "Export Excel", exportCsv: "Export CSV",
        selectMunicipality: "Select municipality", selectKpi: "Select KPI", calculate: "Calculate",
        calculatedValue: "Calculated value", officialValue: "Official value", difference: "Difference",
        percentagePoints: "percentage points", toleranceWarning: "The difference is larger than expected. Please review the input values and data basis.",
        missingValue: "Value missing", enterManually: "Please enter manually", viewMethodology: "View Methodology",
        inputValues: "Input values", calculationSteps: "Calculation steps", variableExplanation: "Meaning of variables",
        dataSource: "Data source", dataYear: "Data year", definition: "Definition", unit: "Unit",
        result: "Result", notApplicable: "not applicable", invalidValue: "Invalid value", divisionByZero: "Division by zero is not allowed"
      }
    };
    const useT = () => {
      const [lang, setLang] = useState(() => localStorage.getItem("lang") || "de");
      useEffect(() => { currentLang = lang; }, [lang]);
      const t = (key) => TRANSLATIONS[lang][key] || key;
      const changeLang = (l) => { localStorage.setItem("lang", l); setLang(l); };
      return { t, lang, changeLang };
    };

    // --- API helper ---
    const API_BASE = window.location.origin;
    const apiFetch = async (path, options = {}) => {
      const url = `${API_BASE}${path}`;
      const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    };

    // --- Auth context ---
    const AuthContext = createContext({ user: null, loading: true, login: () => {}, register: () => {}, logout: () => {}, updateProfile: () => {} });
    const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchMe = async () => {
        setLoading(true);
        const { ok, data } = await apiFetch("/api/auth/me");
        if (ok && data.user) {
          setUser(data.user);
          if (data.user.language) {
            localStorage.setItem("lang", data.user.language);
            currentLang = data.user.language;
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      };

      useEffect(() => { fetchMe(); }, []);

      const login = async (email, password) => {
        setError(null);
        const { ok, data } = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
        if (ok && data.success) {
          setUser(data.user);
          if (data.user.language) localStorage.setItem("lang", data.user.language);
          return { success: true };
        }
        setError(data.errors ? data.errors.join(" ") : "Login failed.");
        return { success: false, error: data.errors ? data.errors.join(" ") : "Login failed." };
      };

      const register = async (name, email, password, language = "de") => {
        setError(null);
        const { ok, data } = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, language }) });
        if (ok && data.success) {
          setUser(data.user);
          if (data.user.language) localStorage.setItem("lang", data.user.language);
          return { success: true };
        }
        setError(data.errors ? data.errors.join(" ") : "Registration failed.");
        return { success: false, error: data.errors ? data.errors.join(" ") : "Registration failed." };
      };

      const logout = async () => {
        await apiFetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      };

      const updateProfile = async (updates) => {
        setError(null);
        const { ok, data } = await apiFetch("/api/auth/profile", { method: "PUT", body: JSON.stringify(updates) });
        if (ok && data.success) {
          setUser(data.user);
          if (data.user.language) localStorage.setItem("lang", data.user.language);
          return { success: true };
        }
        setError(data.errors ? data.errors.join(" ") : "Update failed.");
        return { success: false, error: data.errors ? data.errors.join(" ") : "Update failed." };
      };

      return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
          {children}
        </AuthContext.Provider>
      );
    };
    const useAuth = () => useContext(AuthContext);

    const fmt = (v, dec = 0) => {
      if (v === null || v === undefined || isNaN(v)) return "-";
      const opts = { minimumFractionDigits: dec, maximumFractionDigits: dec };
      return Number(v).toLocaleString(currentLang === "de" ? "de-DE" : "en-US", opts);
    };
    const round = (v, dec = 0) => {
      if (v === null || v === undefined || isNaN(v)) return v;
      const f = Math.pow(10, dec);
      return Math.round(v * f) / f;
    };

    const statusInfo = (score, thresholds) => {
      if (score === null || score === undefined) return { text: "noData", color: "#9AA69B", label: TRANSLATIONS[currentLang].noData };
      if (score >= thresholds.green) return { text: "excellent", color: "#059669", label: TRANSLATIONS[currentLang].excellent };
      if (score >= thresholds.yellow) return { text: "good", color: "#D97706", label: TRANSLATIONS[currentLang].good };
      return { text: "weak", color: "#DC2626", label: TRANSLATIONS[currentLang].weak };
    };

    // --- Exports ---
    const getExportRows = (municipalityIds, stakeholderId) => {
      const rows = [];
      const stakeholder = BENCHMARK_DATA.stakeholders[stakeholderId];
      const now = new Date().toLocaleDateString(currentLang === "de" ? "de-DE" : "en-US");
      rows.push({ type: "meta", key: currentLang === "de" ? "Exportdatum" : "Export date", value: now });
      rows.push({ type: "meta", key: currentLang === "de" ? "Stakeholder-Sicht" : "Stakeholder view", value: stakeholder.name[currentLang] });
      for (const mid of municipalityIds) {
        const m = BENCHMARK_DATA.municipalities.find(x => x.id === mid);
        rows.push({ type: "municipality", key: currentLang === "de" ? "Kommune" : "Municipality", value: m.name[currentLang] });
        for (const kpi of BENCHMARK_DATA.kpis) {
          const score = BENCHMARK_DATA.values[mid].kpis[kpi.id];
          rows.push({ type: "kpi", key: kpi.name[currentLang], value: score !== null ? score + "%" : "-", unit: "%", source: kpi.source[currentLang] || kpi.source, year: kpi.lastUpdate });
          for (const sub of kpi.subIndicators) {
            const sv = BENCHMARK_DATA.values[mid][kpi.id].sub[sub.id];
            rows.push({ type: "sub", key: "  " + (sub.name[currentLang] || sub.name), value: sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) : TRANSLATIONS[currentLang].noData, unit: sv.unit, source: sv.source, year: sv.date, normalized: sv.normalized !== null && sv.normalized !== undefined ? sv.normalized + "%" : "-" });
          }
        }
        rows.push({ type: "profile", key: currentLang === "de" ? "Gesamtscore" : "Overall score", value: BENCHMARK_DATA.values[mid].overall + "%" });
      }
      return rows;
    };

    const exportCSV = (municipalityIds, stakeholderId) => {
      const rows = getExportRows(municipalityIds, stakeholderId);
      const header = ["Typ", "Kennzahl", "Wert", "Einheit", "Normiert", "Quelle", "Jahr"];
      const lines = [header.join(";")];
      for (const r of rows) {
        lines.push([r.type, r.key, r.value, r.unit || "", r.normalized || "", r.source || "", r.year || ""].join(";"));
      }
      const blob = new Blob(["\\ufeff" + lines.join("\\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `smartcity-export-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const exportExcel = (municipalityIds, stakeholderId) => {
      const rows = getExportRows(municipalityIds, stakeholderId);
      const wsData = [["Typ", "Kennzahl", "Wert", "Einheit", "Normiert", "Quelle", "Jahr"]];
      for (const r of rows) wsData.push([r.type, r.key, r.value, r.unit || "", r.normalized || "", r.source || "", r.year || ""]);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Export");
      XLSX.writeFile(wb, `smartcity-export-${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    const exportPDF = (municipalityIds, stakeholderId) => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const rows = getExportRows(municipalityIds, stakeholderId);
      doc.setFontSize(16);
      doc.text("Smart City Benchmarking", 14, 20);
      doc.setFontSize(10);
      let y = 30;
      for (const r of rows) {
        if (y > 270) { doc.addPage(); y = 20; }
        const line = `${r.type === "municipality" ? "" : "  "}${r.key}: ${r.value} ${r.unit || ""}${r.normalized ? " (" + r.normalized + ")" : ""}${r.source ? " [" + r.source + "]" : ""}`;
        doc.text(line, r.type === "municipality" ? 14 : 18, y);
        y += 6;
      }
      doc.save(`smartcity-export-${new Date().toISOString().slice(0,10)}.pdf`);
    };

    // --- Components ---
    const TrafficLight = ({ score, thresholds, showLabel = true }) => {
      const info = statusInfo(score, thresholds);
      return (
        <div className="flex items-center gap-2" title={info.label}>
          <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 bg-white" style={{ borderColor: info.color }}>
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: info.color }}></div>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold" style={{ color: info.color }}>{score !== null ? fmt(score, 0) + "%" : "-"}</div>
            {showLabel && <div className="text-xs text-gray-500">{info.label}</div>}
          </div>
        </div>
      );
    };

    const ScoreRing = ({ score, size = 56, stroke = 6 }) => {
      const r = (size - stroke) / 2;
      const c = 2 * Math.PI * r;
      const pct = score !== null ? score : 0;
      const dash = `${pct * c / 100} ${c}`;
      const color = score !== null ? statusInfo(score, BENCHMARK_DATA.config.scoreThresholds).color : "#9AA69B";
      return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="transparent" />
            <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="transparent" strokeDasharray={dash} strokeLinecap="round" />
          </svg>
          <div className="absolute text-sm font-bold" style={{ color }}>{score !== null ? fmt(score,0) : "-"}</div>
        </div>
      );
    };

    const ExportButtons = ({ municipalityIds, stakeholderId }) => {
      const isDe = currentLang === "de";
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportPDF(municipalityIds, stakeholderId)} className="px-3 py-1.5 rounded-lg bg-low text-white text-sm font-medium hover:bg-low/90">{isDe ? "PDF exportieren" : "Export PDF"}</button>
          <button onClick={() => exportExcel(municipalityIds, stakeholderId)} className="px-3 py-1.5 rounded-lg bg-good text-white text-sm font-medium hover:bg-good/90">{isDe ? "Excel exportieren" : "Export Excel"}</button>
          <button onClick={() => exportCSV(municipalityIds, stakeholderId)} className="px-3 py-1.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy/90">{isDe ? "CSV exportieren" : "Export CSV"}</button>
        </div>
      );
    };

    const StakeholderSelector = ({ stakeholder, setStakeholder }) => {
      const isDe = currentLang === "de";
      return (
        <div className="bg-white rounded-2xl p-4 card-shadow border border-gray-100 mb-6">
          <div className="text-sm text-muted mb-2">{isDe ? "Stakeholder-Sicht" : "Stakeholder view"}</div>
          <div className="flex flex-wrap gap-2">
            {Object.values(BENCHMARK_DATA.stakeholders).map(s => (
              <button key={s.id} onClick={() => setStakeholder(s.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${stakeholder === s.id ? "bg-forest text-white border-forest" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                {s.name[currentLang]}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">{BENCHMARK_DATA.stakeholders[stakeholder].description[currentLang]}</div>
        </div>
      );
    };

    const KpiDetailModal = ({ kpi, municipality, onClose, scores }) => {
      if (!kpi || !municipality) return null;
      const v = BENCHMARK_DATA.values[municipality.id][kpi.id];
      const score = scores[municipality.id].kpis[kpi.id];
      const info = statusInfo(score, kpi.thresholds);
      const isDe = currentLang === "de";
      // Compute calculation values per sub-indicator
      const calcSubs = kpi.subIndicators.map(sub => {
        const sv = v.sub[sub.id];
        const allRaw = BENCHMARK_DATA.municipalities.map(m => {
          const val = BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id][kpi.id] && BENCHMARK_DATA.values[m.id][kpi.id].sub ? BENCHMARK_DATA.values[m.id][kpi.id].sub[sub.id].raw : null;
          return val;
        }).filter(r => r !== null && r !== undefined);
        const min = allRaw.length ? Math.min(...allRaw) : null;
        const max = allRaw.length ? Math.max(...allRaw) : null;
        let norm = null;
        let weighted = null;
        if (sv.raw !== null && sv.raw !== undefined && min !== null && max !== null && min !== max) {
          norm = sub.higherIsBetter ? ((sv.raw - min) / (max - min)) * 100 : ((max - sv.raw) / (max - min)) * 100;
          weighted = norm * sub.weight;
        }
        return { sub, sv, min, max, norm, weighted };
      });
      const totalWeight = calcSubs.reduce((sum, s) => s.norm !== null ? sum + s.sub.weight : sum, 0);
      const totalWeighted = calcSubs.reduce((sum, s) => s.weighted !== null ? sum + s.weighted : sum, 0);
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 card-shadow" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-ink">{kpi.name[currentLang]}</h2>
                <div className="text-muted text-sm">{municipality.name[currentLang]}</div>
              </div>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-ink">×</button>
            </div>
            <div className="mb-4 p-4 rounded-xl bg-paper border border-gray-100">
              <div className="text-sm text-muted mb-1">{isDe ? "Gesamtscore" : "Overall score"}</div>
              <div className="flex items-center gap-3">
                <ScoreRing score={score} size={72} stroke={8} />
                <div className="text-lg font-semibold" style={{ color: info.color }}>{info.label}</div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{kpi.description[currentLang]}</p>
            <h3 className="font-semibold mb-2">{isDe ? "Formel" : "Formula"}</h3>
            <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg mb-4 overflow-x-auto">{kpi.formula}</div>
            <h3 className="font-semibold mb-2">{isDe ? "Berechnung" : "Calculation"}</h3>
            <div className="font-mono text-sm bg-slate-50 p-3 rounded-lg mb-4 overflow-x-auto">
              {calcSubs.map(({ sub, sv, min, max, norm, weighted }, idx) => {
                if (sv.raw === null || sv.raw === undefined || min === null || max === null || min === max) {
                  return <div key={sub.id} className={idx > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>{sub.name[currentLang] || sub.name}: {isDe ? "Keine Berechnung möglich" : "No calculation possible"}</div>;
                }
                const formulaText = sub.higherIsBetter ? (isDe ? "(Wert − Min) / (Max − Min) × 100" : "(Value − Min) / (Max − Min) × 100") : (isDe ? "(Max − Wert) / (Max − Min) × 100" : "(Max − Value) / (Max − Min) × 100");
                const substText = sub.higherIsBetter ? `(${fmt(sv.raw,2)} − ${fmt(min,2)}) / (${fmt(max,2)} − ${fmt(min,2)}) × 100 = ${fmt(norm,1)}%` : `(${fmt(max,2)} − ${fmt(sv.raw,2)}) / (${fmt(max,2)} − ${fmt(min,2)}) × 100 = ${fmt(norm,1)}%`;
                return (
                  <div key={sub.id} className={idx > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>
                    <div className="font-semibold">{sub.name[currentLang] || sub.name}</div>
                    <div className="pl-2">{isDe ? "Normierung" : "Normalization"}: {formulaText}</div>
                    <div className="pl-2">{substText}</div>
                    <div className="pl-2">{isDe ? "Gewichteter Beitrag" : "Weighted contribution"}: {fmt(norm,1)}% × {fmt(sub.weight*100,0)}% = {fmt(weighted,2)}</div>
                  </div>
                );
              })}
              <div className="mt-3 pt-2 border-t border-gray-400 font-semibold">
                {isDe ? "Kategorie-Score" : "Category score"} = {totalWeighted > 0 ? `${fmt(totalWeighted,2)} / ${fmt(totalWeight,2)} = ${fmt(score,1)}` : (isDe ? "nicht berechenbar" : "not calculable")}
              </div>
            </div>
            <h3 className="font-semibold mb-2">{isDe ? "Rohdaten und Quellen" : "Raw data and sources"}</h3>
            <table className="w-full text-sm mb-4">
              <thead><tr className="text-left text-muted border-b"><th className="pb-2">{isDe ? "Indikator" : "Indicator"}</th><th className="pb-2">{isDe ? "Rohwert" : "Raw value"}</th><th className="pb-2">{isDe ? "Richtung" : "Direction"}</th><th className="pb-2">{isDe ? "Gewicht" : "Weight"}</th><th className="pb-2">{isDe ? "Normiert" : "Normalized"}</th><th className="pb-2">{isDe ? "Quelle" : "Source"}</th><th className="pb-2">{isDe ? "Jahr" : "Year"}</th></tr></thead>
              <tbody>
                {kpi.subIndicators.map(sub => {
                  const sv = v.sub[sub.id];
                  return (
                    <tr key={sub.id} className="border-b border-gray-50">
                      <td className="py-2 font-medium">{sub.name[currentLang] || sub.name}</td>
                      <td className="py-2">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{TRANSLATIONS[currentLang].noData}</span>}</td>
                      <td className="py-2 text-xs">{sub.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better")}</td>
                      <td className="py-2 text-muted">{fmt(sub.weight*100,0)}%</td>
                      <td className="py-2">{sv.normalized !== null && sv.normalized !== undefined ? sv.normalized + "%" : "-"}</td>
                      <td className="py-2 text-muted">{sv.source || "-"}</td>
                      <td className="py-2 text-muted">{sv.date || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-xs text-muted">{isDe ? "Datenquelle KPI: " : "KPI data source: "}{kpi.source[currentLang] || kpi.source} · {isDe ? "Letztes Update: " : "Last update: "}{kpi.lastUpdate}</div>
          </div>
        </div>
      );
    };

    const CategoryDetailModal = ({ kpi, onClose, scores }) => {
      if (!kpi) return null;
      const isDe = currentLang === "de";
      // Min/max per sub-indicator for normalization
      const subStats = kpi.subIndicators.map(sub => {
        const allRaw = BENCHMARK_DATA.municipalities.map(m => {
          const sv = BENCHMARK_DATA.values && BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id][kpi.id] && BENCHMARK_DATA.values[m.id][kpi.id].sub ? BENCHMARK_DATA.values[m.id][kpi.id].sub[sub.id] : { raw: null };
          return sv.raw;
        }).filter(r => r !== null && r !== undefined);
        return { sub, min: allRaw.length ? Math.min(...allRaw) : null, max: allRaw.length ? Math.max(...allRaw) : null };
      });
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 card-shadow" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-ink">{kpi.name[currentLang]}</h2>
                <div className="text-muted text-sm">{isDe ? "Vergleich aller Kommunen" : "Comparison of all municipalities"}</div>
              </div>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-ink">×</button>
            </div>
            <p className="text-gray-700 mb-4">{kpi.description[currentLang]}</p>
            <div className="mb-4 p-4 rounded-xl bg-paper border border-gray-100">
              <h3 className="font-semibold mb-2">{isDe ? "Formel" : "Formula"}</h3>
              <div className="font-mono text-sm bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto mb-3">{kpi.formula}</div>
              <h3 className="font-semibold mb-2">{isDe ? "Normierung je Indikator" : "Normalization per indicator"}</h3>
              <div className="font-mono text-sm bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto">
                {subStats.map(({ sub, min, max }, idx) => {
                  if (min === null || max === null || min === max) return <div key={sub.id}>{sub.name[currentLang] || sub.name}: {isDe ? "keine Varianz" : "no variance"}</div>;
                  const dir = sub.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better");
                  const formula = sub.higherIsBetter ? (isDe ? "(Wert − Min) / (Max − Min) × 100" : "(Value − Min) / (Max − Min) × 100") : (isDe ? "(Max − Wert) / (Max − Min) × 100" : "(Max − Value) / (Max − Min) × 100");
                  return <div key={sub.id}>{sub.name[currentLang] || sub.name}: {dir}, Min={fmt(min,2)}, Max={fmt(max,2)} → {formula}</div>;
                })}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-paper">
                  <tr className="text-left text-muted border-b">
                    <th className="p-3">{isDe ? "Kommune" : "Municipality"}</th>
                    <th className="p-3">{isDe ? "Gesamtscore" : "Total score"}</th>
                    {kpi.subIndicators.map(sub => <th key={sub.id} className="p-3">{sub.name[currentLang] || sub.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_DATA.municipalities.map(m => {
                    const score = scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[kpi.id] : null;
                    return (
                      <tr key={m.id} className="border-b border-gray-50">
                        <td className="p-3 font-medium">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</td>
                        <td className="p-3"><TrafficLight score={score} thresholds={kpi.thresholds} /></td>
                        {kpi.subIndicators.map(sub => {
                          const sv = BENCHMARK_DATA.values && BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id][kpi.id] && BENCHMARK_DATA.values[m.id][kpi.id].sub ? BENCHMARK_DATA.values[m.id][kpi.id].sub[sub.id] : { raw: null, normalized: null, unit: sub.unit };
                          return (
                            <td key={sub.id} className="p-3">
                              <div className="font-mono">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{TRANSLATIONS[currentLang].noData}</span>}</div>
                              <div className="text-xs text-muted">{sv.normalized !== null && sv.normalized !== undefined ? fmt(sv.normalized, 0) + "%" : "-"}</div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-muted mt-4">{isDe ? "Datenquelle KPI: " : "KPI data source: "}{kpi.source[currentLang] || kpi.source} · {isDe ? "Letztes Update: " : "Last update: "}{kpi.lastUpdate}</div>
          </div>
        </div>
      );
    };

    const Navigation = ({ t, lang, changeLang, stakeholder, setStakeholder }) => {
      const [open, setOpen] = useState(false);
      const { user, logout } = useAuth();
      const navigate = (path) => { window.location.hash = "#" + path; };
      const stakeholderOptions = Object.values(BENCHMARK_DATA.stakeholders).map(s => ({ id: s.id, label: s.name[currentLang] }));
      const mainLinks = [
        { to: "/", label: t("dashboard") },
        { to: "/municipalities", label: t("municipalities") },
        { to: "/compare", label: t("comparison") },
        { to: "/ranking", label: t("ranking") },
        { to: "/maps", label: t("maps") },
        { to: "/calculator", label: t("calculator") },
        { to: "/methodology", label: t("methodology") },
        { to: "/catalogue", label: currentLang === "de" ? "KPI-Katalog" : "KPI Catalogue" },
        { to: "/ai", label: t("ai") },
      ];
      return (
        <nav className="glass fixed top-0 left-0 right-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-sm">SCB</div>
                <span className="font-display font-bold text-ink hidden sm:block">Smart City Benchmarking</span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {mainLinks.map(l => (
                  <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-forest/10 text-forest" : "text-gray-600 hover:bg-gray-50"}`}>{l.label}</NavLink>
                ))}
                <select value={stakeholder} onChange={e=>setStakeholder(e.target.value)} className="ml-2 text-sm border rounded-lg px-2 py-1.5 bg-white text-gray-700">
                  {stakeholderOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <div className="ml-2 flex border rounded-lg overflow-hidden text-sm font-medium">
                  <button onClick={()=>changeLang("de")} className={`px-2 py-1 ${lang==="de"?"bg-forest text-white":"bg-white text-gray-600"}`}>DE</button>
                  <button onClick={()=>changeLang("en")} className={`px-2 py-1 ${lang==="en"?"bg-forest text-white":"bg-white text-gray-600"}`}>EN</button>
                </div>
                {user ? (
                  <div className="ml-2 flex items-center gap-2">
                    <Link to="/profile" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{user.name}</Link>
                    <button onClick={() => { logout(); navigate("/"); }} className="px-3 py-2 rounded-lg text-sm font-medium text-low hover:bg-red-50">{t("logout")}</button>
                  </div>
                ) : (
                  <div className="ml-2 flex items-center gap-1">
                    <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-medium text-forest hover:bg-forest/10">{t("login")}</Link>
                    <Link to="/register" className="px-3 py-2 rounded-lg text-sm font-medium bg-forest text-white hover:bg-forest/90">{currentLang === "de" ? "Registrieren" : "Register"}</Link>
                  </div>
                )}
              </div>
              <button className="md:hidden text-ink" onClick={()=>setOpen(!open)}>☰</button>
            </div>
            {open && (
              <div className="md:hidden pb-4 space-y-1">
                {mainLinks.map(l => <NavLink key={l.to} to={l.to} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{l.label}</NavLink>)}
                <select value={stakeholder} onChange={e=>setStakeholder(e.target.value)} className="block text-sm border rounded-lg px-3 py-2 bg-white text-gray-700 w-full mt-2">
                  {stakeholderOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <div className="flex border rounded-lg overflow-hidden w-max mt-2">
                  <button onClick={()=>changeLang("de")} className={`px-3 py-1 ${lang==="de"?"bg-forest text-white":"bg-white"}`}>DE</button>
                  <button onClick={()=>changeLang("en")} className={`px-3 py-1 ${lang==="en"?"bg-forest text-white":"bg-white"}`}>EN</button>
                </div>
                {user ? (
                  <>
                    <Link to="/profile" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{user.name}</Link>
                    <button onClick={() => { logout(); navigate("/"); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-low hover:bg-red-50">{t("logout")}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{t("login")}</Link>
                    <Link to="/register" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{currentLang === "de" ? "Registrieren" : "Register"}</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      );
    };

    const Layout = ({ children, stakeholder, setStakeholder }) => {
      const { t, lang, changeLang } = useT();
      return (
        <div className="min-h-screen flex flex-col">
          <Navigation t={t} lang={lang} changeLang={changeLang} stakeholder={stakeholder} setStakeholder={setStakeholder} />
          <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">{children}</main>
          <footer className="border-t border-gray-200 bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
              <span>© 2026 Smart City Benchmarking · {lang === "de" ? "Hochschulprojekt" : "University project"}</span>
              <span>{lang === "de" ? "Daten: INKAR / BBSR" : "Data: INKAR / BBSR"}</span>
            </div>
          </footer>
        </div>
      );
    };

    const MunicipalityMap = ({ municipality, height = "300px" }) => {
      const mapRef = useRef(null);
      const containerRef = useRef(null);
      useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        mapRef.current = L.map(containerRef.current).setView([municipality.lat, municipality.lng], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(mapRef.current);
        L.marker([municipality.lat, municipality.lng]).addTo(mapRef.current).bindPopup(`<b>${municipality.name[currentLang]}</b><br/>${municipality.kreis}`);
        L.circle([municipality.lat, municipality.lng], { color: municipality.color, fillColor: municipality.color, fillOpacity: 0.15, radius: 3500 }).addTo(mapRef.current);
        return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
      }, [municipality]);
      return <div ref={containerRef} style={{ height }} className="rounded-2xl border border-gray-100 w-full" />;
    };

    const Dashboard = ({ scores, setModal, setCategoryModal, stakeholder, setStakeholder }) => {
      const { t } = useT();
      const isDe = currentLang === "de";
      const chartRef = useRef(null);
      useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: BENCHMARK_DATA.municipalities.map(m => m.name[currentLang]),
            datasets: BENCHMARK_DATA.kpis.map((kpi, i) => (
              { label: kpi.name[currentLang], data: BENCHMARK_DATA.municipalities.map(m => scores && scores[m.id] && scores[m.id].kpis ? (scores[m.id].kpis[kpi.id] || 0) : 0), backgroundColor: ["#064E3B", "#1A3A4A", "#D4A017", "#7A4E6D"][i] }
            ))
          },
          options: { responsive: true, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, max: 100 } } }
        });
        return () => chart.destroy();
      }, [scores]);
      const sorted = [...BENCHMARK_DATA.municipalities].sort((a,b) => ((scores && scores[b.id] ? scores[b.id].overall : 0)||0) - ((scores && scores[a.id] ? scores[a.id].overall : 0)||0));
      return (
        <div>
          <section className="premium-gradient rounded-3xl p-8 md:p-12 text-white mb-8 hero-pattern">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{t("appTitle")}</h1>
              <p className="text-lg md:text-xl text-emerald-100">{t("appSubtitle")}</p>
            </div>
          </section>
          <StakeholderSelector stakeholder={stakeholder} setStakeholder={setStakeholder} />
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {BENCHMARK_DATA.kpis.map(kpi => {
              const avgScore = (() => {
                const vals = BENCHMARK_DATA.municipalities.map(m => scores[m.id].kpis[kpi.id]).filter(s => s !== null && s !== undefined);
                return vals.length ? round(vals.reduce((a,b)=>a+b,0)/vals.length,1) : null;
              })();
              return (
                <div key={kpi.id} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-sm">{kpi.name[currentLang].substring(0,2)}</div>
                    <ScoreRing score={avgScore} size={56} stroke={5} />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1">{kpi.name[currentLang]}</h3>
                  <p className="text-xs text-muted mb-3 line-clamp-2">{kpi.description[currentLang]}</p>
                  <div className="text-xs text-gray-500 mb-3">{isDe ? "Gewicht:" : "Weight:"} {fmt(kpi.weight*100,0)}%</div>
                  <button onClick={()=>setCategoryModal({ kpi })} className="w-full py-1.5 text-sm font-medium text-forest bg-forest/5 rounded-lg hover:bg-forest/10">{isDe ? "Details anzeigen" : "Show details"}</button>
                </div>
              );
            })}
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {BENCHMARK_DATA.municipalities.map(m => {
              if (!m || !m.id) return null;
              const sc = scores && scores[m.id] ? scores[m.id] : {};
              const kpisArr = BENCHMARK_DATA.kpis.map(k => ({ id: k.id, name: k.name[currentLang], score: sc.kpis ? sc.kpis[k.id] : null }));
              const best = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>b.score-a.score)[0];
              const worst = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>a.score-b.score)[0];
              return (
                <Link key={m.id} to={`/municipality/${m.id}`} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100 block">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
                    <ScoreRing score={sc.overall} size={56} stroke={5} />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</h3>
                  <div className="text-xs text-muted mb-3">{m.kreis || ""} · {fmt(m.population)} EW</div>
                  <div className="space-y-1 text-sm">
                    {best && <div className="flex justify-between"><span className="text-gray-500">{t("strongestKpi")}:</span><span className="font-medium text-good">{best.name}</span></div>}
                    {worst && <div className="flex justify-between"><span className="text-gray-500">{t("weakestKpi")}:</span><span className="font-medium text-low">{worst.name}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-500">{t("dataCompleteness")}:</span><span className="font-medium">{sc.completeness !== undefined ? sc.completeness + "%" : "-"}</span></div>
                  </div>
                </Link>
              );
            })}
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow border border-gray-100">
              <h2 className="text-xl font-bold text-ink mb-4">{isDe ? "Vergleich der KPIs" : "KPI Comparison"}</h2>
              <canvas ref={chartRef} height="200"></canvas>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
              <h2 className="text-xl font-bold text-ink mb-4">{t("ranking")}</h2>
              <ol className="space-y-3">
                {sorted.map((m, i) => {
                  if (!m || !m.id) return null;
                  const ov = scores && scores[m.id] ? scores[m.id].overall : null;
                  return (
                    <li key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-paper">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">{i+1}</span>
                        <span className="font-medium">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</span>
                      </div>
                      <span className="font-bold" style={{ color: statusInfo(ov, BENCHMARK_DATA.config.scoreThresholds).color }}>{ov !== null && ov !== undefined ? ov + "%" : "-"}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
          <section className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-ink">{isDe ? "Export" : "Export"}</h2>
              <ExportButtons municipalityIds={BENCHMARK_DATA.municipalities.map(m=>m.id)} stakeholderId={stakeholder} />
            </div>
            <p className="text-sm text-gray-600">{isDe ? "Exportieren Sie alle Kommunen mit der aktuellen Stakeholder-Sicht als PDF, Excel oder CSV." : "Export all municipalities with the current stakeholder view as PDF, Excel or CSV."}</p>
          </section>
        </div>
      );
    };

    const Compare = ({ scores, setModal, stakeholder, setStakeholder }) => {
      const { t } = useT();
      const isDe = currentLang === "de";
      const [showRaw, setShowRaw] = useState(false);
      const [level, setLevel] = useState("category"); // "category" | "indicator"
      const allIndicators = BENCHMARK_DATA.kpis.flatMap(k => k.subIndicators.map(sub => ({ ...sub, categoryId: k.id, categoryName: k.name[currentLang] })));
      return (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-ink">{t("comparison")}</h1>
            <ExportButtons municipalityIds={BENCHMARK_DATA.municipalities.map(m=>m.id)} stakeholderId={stakeholder} />
          </div>
          <StakeholderSelector stakeholder={stakeholder} setStakeholder={setStakeholder} />
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">{isDe ? "Ebene:" : "Level:"}</span>
            <button onClick={()=>setLevel("category")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${level==="category"?"bg-forest text-white":"bg-white border"}`}>{isDe ? "Kategorien" : "Categories"}</button>
            <button onClick={()=>setLevel("indicator")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${level==="indicator"?"bg-forest text-white":"bg-white border"}`}>{isDe ? "Einzel-KPIs" : "Individual KPIs"}</button>
            <span className="text-sm text-gray-500 ml-2">{isDe ? "Ansicht:" : "View:"}</span>
            <button onClick={()=>setShowRaw(false)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!showRaw ? "bg-forest text-white" : "bg-white border"}`}>{t("score")}</button>
            <button onClick={()=>setShowRaw(true)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${showRaw ? "bg-forest text-white" : "bg-white border"}`}>{t("rawValue")}</button>
          </div>
          <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-paper">
                <tr>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Kennzahl" : "Indicator"}</th>
                  {BENCHMARK_DATA.municipalities.map(m => m && m.id ? <th key={m.id} className="p-4 text-center font-semibold text-ink">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</th> : null)}
                </tr>
              </thead>
              <tbody>
                {level === "category" ? BENCHMARK_DATA.kpis.map(kpi => (
                  <tr key={kpi.id} className="border-t border-gray-100">
                    <td className="p-4 align-top">
                      <div className="font-semibold text-ink">{kpi.name[currentLang]}</div>
                      <div className="text-xs text-muted">{fmt(kpi.weight*100,0)}% · {kpi.subIndicators.length} {isDe ? "Indikatoren" : "indicators"}</div>
                      <button onClick={()=>setModal({ kpi, municipality: BENCHMARK_DATA.municipalities[0] })} className="text-xs text-forest hover:underline mt-1">{t("howCalculated")}</button>
                    </td>
                    {BENCHMARK_DATA.municipalities.map(m => {
                      if (!m || !m.id) return null;
                      const score = scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[kpi.id] : null;
                      return (
                        <td key={m.id} className="p-4 align-top">
                          <div className="flex flex-col items-center gap-2">
                            {!showRaw ? (
                              <TrafficLight score={score} thresholds={kpi.thresholds} />
                            ) : (
                              <div className="text-center font-mono font-medium">{score !== null && score !== undefined ? score + " " + (kpi.unit[currentLang] || "") : <span className="text-gray-400 italic">{t("noData")}</span>}</div>
                            )}
                            <button onClick={()=>setModal({ kpi, municipality: m })} className="text-xs text-gray-400 hover:text-forest">{isDe ? "Details" : "Details"}</button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                )) : allIndicators.map(ind => (
                  <tr key={ind.id} className="border-t border-gray-100">
                    <td className="p-4 align-top">
                      <div className="font-semibold text-ink">{ind.name[currentLang] || ind.name}</div>
                      <div className="text-xs text-muted">{ind.categoryName} · {fmt(ind.weight*100,1)}%</div>
                    </td>
                    {BENCHMARK_DATA.municipalities.map(m => {
                      if (!m || !m.id) return null;
                      const sv = scores && scores[m.id] && scores[m.id][ind.categoryId] && scores[m.id][ind.categoryId].sub ? scores[m.id][ind.categoryId].sub[ind.id] : { raw: null, normalized: null, unit: ind.unit };
                      return (
                        <td key={m.id} className="p-4 align-top">
                          <div className="flex flex-col items-center gap-1">
                            {!showRaw ? (
                              <TrafficLight score={sv.normalized} thresholds={BENCHMARK_DATA.config.scoreThresholds} />
                            ) : (
                              <div className="text-center font-mono font-medium">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{t("noData")}</span>}</div>
                            )}
                            <div className="text-xs text-muted">{sv.normalized !== null && sv.normalized !== undefined ? fmt(sv.normalized,1) + "%" : "-"}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const Ranking = ({ scores, categoryWeights }) => {
      const { t } = useT();
      const isDe = currentLang === "de";
      const categories = [{id: "overall", name: t("overallScore")}, ...BENCHMARK_DATA.kpis.map(k => ({ id: k.id, name: k.name[currentLang] }))];
      return (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-ink">{t("ranking")}</h1>
            <Link to="/weights" className="px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium hover:bg-forest/90">{isDe ? "Gewichtung anpassen" : "Adjust weights"}</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
            <h2 className="font-semibold mb-2">{isDe ? "Aktive Gewichtung" : "Active weights"}</h2>
            <div className="flex flex-wrap gap-3">
              {BENCHMARK_DATA.kpis.map(k => <span key={k.id} className="px-3 py-1 rounded-lg bg-paper text-sm">{k.name[currentLang]}: {fmt((categoryWeights && categoryWeights[k.id] !== undefined ? categoryWeights[k.id] : k.weight)*100,0)}%</span>)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(cat => {
              const list = [...BENCHMARK_DATA.municipalities].sort((a,b) => {
                const av = cat.id === "overall" ? (scores && scores[a.id] ? scores[a.id].overall : null) : (scores && scores[a.id] && scores[a.id].kpis ? scores[a.id].kpis[cat.id] : null);
                const bv = cat.id === "overall" ? (scores && scores[b.id] ? scores[b.id].overall : null) : (scores && scores[b.id] && scores[b.id].kpis ? scores[b.id].kpis[cat.id] : null);
                return (bv||0) - (av||0);
              });
              return (
                <div key={cat.id} className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
                  <h3 className="font-bold text-ink mb-3">{cat.name}</h3>
                  <ol className="space-y-2">
                    {list.map((m, i) => {
                      if (!m || !m.id) return null;
                      const score = cat.id === "overall" ? (scores && scores[m.id] ? scores[m.id].overall : null) : (scores && scores[m.id] && scores[m.id].kpis ? scores[m.id].kpis[cat.id] : null);
                      const info = statusInfo(score, BENCHMARK_DATA.config.scoreThresholds);
                      return (
                        <li key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-paper">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-xs flex items-center justify-center font-bold">{i+1}</span>
                            <span className="text-sm font-medium">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: info.color }}>{score !== null && score !== undefined ? score + "%" : "-"}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const Methodology = () => {
      const { t } = useT();
      const isDe = currentLang === "de";
      const [openId, setOpenId] = useState(null);
      useEffect(() => {
        const saved = localStorage.getItem("methodologyOpen");
        if (saved) {
          const match = BENCHMARK_DATA.kpis.find(k => k.id === saved);
          if (match) setOpenId(saved);
          localStorage.removeItem("methodologyOpen");
        }
      }, []);
      useEffect(() => {
        if (openId) {
          const el = document.getElementById(`methodology-${openId}`);
          if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        }
      }, [openId]);
      return (
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">{t("methodology")}</h1>
          <p className="text-gray-600 mb-8">{isDe ? "Transparente Dokumentation aller Berechnungsmethoden." : "Transparent documentation of all calculation methods."}</p>
          <div className="space-y-4">
            {BENCHMARK_DATA.kpis.map(kpi => (
              <div key={kpi.id} id={`methodology-${kpi.id}`} className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
                <button onClick={()=>setOpenId(openId===kpi.id?null:kpi.id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: ["#064E3B", "#1A3A4A", "#D4A017", "#7A4E6D"][BENCHMARK_DATA.kpis.indexOf(kpi)] }}>{kpi.name[currentLang][0]}</div>
                    <div>
                      <h3 className="font-bold text-ink">{kpi.name[currentLang]}</h3>
                      <div className="text-xs text-muted">{kpi.source[currentLang] || kpi.source}</div>
                    </div>
                  </div>
                  <span className="text-xl text-gray-400">{openId===kpi.id ? "−" : "+"}</span>
                </button>
                {openId===kpi.id && (
                  <div className="p-5 border-t border-gray-100 bg-paper/50">
                    <p className="text-gray-700 mb-4">{kpi.description[currentLang]}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">{isDe ? "Mathematische Formel" : "Mathematical formula"}</h4>
                      <div className="font-mono text-sm bg-white border border-gray-200 p-3 rounded-lg overflow-x-auto">{kpi.formula}</div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">{isDe ? "Teilindikatoren und Gewichtung" : "Sub-indicators and weights"}</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {kpi.subIndicators.map(sub => (
                          <li key={sub.id} className="bg-white p-3 rounded-lg border border-gray-100 text-sm">
                            <div className="font-medium">{sub.name[currentLang] || sub.name}</div>
                            <div className="text-muted">{isDe ? "Gewicht: " : "Weight: "}{fmt(sub.weight*100,0)}% · {isDe ? "Einheit: " : "Unit: "}{sub.unit} · {sub.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better")}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">{isDe ? "Ampelschwellen" : "Traffic-light thresholds"}</h4>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">{isDe ? "Grün" : "Green"}: ≥{kpi.thresholds.green}%</span>
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800">{isDe ? "Gelb" : "Yellow"}: {kpi.thresholds.yellow}–{kpi.thresholds.green-1}%</span>
                        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800">{isDe ? "Rot" : "Red"}: {'<'} {kpi.thresholds.yellow}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted">{isDe ? "Letztes Update" : "Last update"}: {kpi.lastUpdate}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };


    // --- KPI Calculator configurations ---
    const CALCULATOR_SECTIONS = [
      { id: "demografie", name: { de: "Bevölkerung & Demografie", en: "Population & Demographics" } },
      { id: "arbeitsmarkt", name: { de: "Arbeitsmarkt", en: "Labour Market" } },
      { id: "kaufkraft", name: { de: "Kaufkraft", en: "Purchasing Power" } },
      { id: "gesundheit", name: { de: "Gesundheit", en: "Healthcare" } },
      { id: "daseinsvorsorge", name: { de: "Daseinsvorsorge", en: "Public Services" } },
      { id: "festnetz", name: { de: "Festnetz", en: "Fixed Network" } },
      { id: "mobilitaet", name: { de: "Mobilität & Sicherheit", en: "Mobility & Safety" } }
    ];

    const CALCULATORS = [
      // A. Demografie
      {
        id: "bevoelkerung",
        section: "demografie",
        name: { de: "Bevölkerung gesamt", en: "Total population" },
        description: { de: "Gesamtbevölkerung der ausgewählten Kommune.", en: "Total population of the selected municipality." },
        type: "display",
        formula: { de: "Bevölkerung gesamt", en: "Total population" },
        unit: "EW",
        input: { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung gesamt", en: "Total population" }, explanation: { de: "Gesamtbevölkerung laut CSV/INKAR.", en: "Total population according to CSV/INKAR." } },
        officialComparison: { indicatorId: "bevoelkerung", unit: "EW" }
      },
      {
        id: "durchschnittsalter",
        section: "demografie",
        name: { de: "Durchschnittsalter", en: "Average age" },
        description: { de: "Durchschnittsalter der Bevölkerung in Jahren.", en: "Average age of the population in years." },
        type: "display",
        formula: { de: "Durchschnittsalter der Bevölkerung", en: "Average age of population" },
        unit: "Jahre",
        input: { id: "durchschnittsalter", source: "durchschnittsalter", name: { de: "Durchschnittsalter", en: "Average age" }, explanation: { de: "Durchschnittsalter in Jahren.", en: "Average age in years." } },
        officialComparison: { indicatorId: "durchschnittsalter", unit: "Jahre" }
      },
      {
        id: "studierende",
        section: "demografie",
        name: { de: "Studierende", en: "Students" },
        description: { de: "Anzahl der Studierenden in der Kommune.", en: "Number of students in the municipality." },
        type: "display",
        formula: { de: "Anzahl der Studierenden", en: "Number of students" },
        unit: "Anzahl",
        input: { id: "studierende", source: "studierende", name: { de: "Studierende", en: "Students" }, explanation: { de: "Anzahl der Studierenden.", en: "Number of students." } },
        officialComparison: { indicatorId: "studierende", unit: "Anzahl" }
      },
      {
        id: "studierende_pro_1000",
        section: "demografie",
        name: { de: "Studierende je 1.000 Einwohner", en: "Students per 1,000 inhabitants" },
        description: { de: "Anzahl der Studierenden bezogen auf 1.000 Einwohner.", en: "Number of students per 1,000 inhabitants." },
        type: "rate",
        formula: { de: "Studierende / Bevölkerung × 1.000", en: "Students / population × 1,000" },
        unit: { de: "je 1.000 EW", en: "per 1,000 inh." },
        higherIsBetter: true,
        tolerance: 0.5,
        inputs: [
          { id: "studierende", source: "studierende", name: { de: "Studierende", en: "Students" }, explanation: { de: "Anzahl der Studierenden.", en: "Number of students." }, min: 0 },
          { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung", en: "Population" }, explanation: { de: "Gesamtbevölkerung.", en: "Total population." }, min: 0 }
        ],
        officialComparison: null,
        calculate: (vals, isDe) => {
          const result = (vals.studierende / vals.bevoelkerung) * 1000;
          return {
            result,
            steps: [
              isDe ? "Studierende je 1.000 EW = Studierende / Bevölkerung × 1.000" : "Students per 1,000 inh. = Students / population × 1,000",
              `= ${fmt(vals.studierende, 0)} / ${fmt(vals.bevoelkerung, 0)} × 1.000`,
              `= ${fmt(result, 2)}`
            ]
          };
        }
      },
      // B. Arbeitsmarkt
      {
        id: "beschaeftigtenquote",
        section: "arbeitsmarkt",
        name: { de: "Beschäftigtenquote", en: "Employment rate" },
        description: { de: "Anteil der Beschäftigten an der Bevölkerung im erwerbsfähigen Alter.", en: "Share of employed people in the working-age population." },
        type: "formula",
        formula: { de: "Beschäftigte / Bevölkerung im erwerbsfähigen Alter × 100", en: "Employed / working-age population × 100" },
        unit: "%",
        higherIsBetter: true,
        tolerance: 1.0,
        inputs: [
          { id: "beschaeftigte", source: null, name: { de: "Beschäftigte", en: "Employed" }, explanation: { de: "Anzahl der erwerbstätigen Personen (manuell einzugeben).", en: "Number of employed persons (enter manually)." }, min: 0 },
          { id: "erwerbsfaehige", source: null, name: { de: "Bevölkerung im erwerbsfähigen Alter", en: "Working-age population" }, explanation: { de: "Bevölkerung zwischen 15 und 64 Jahren (manuell einzugeben).", en: "Population aged 15 to 64 (enter manually)." }, min: 0 }
        ],
        officialComparison: { indicatorId: "beschaeftigtenquote", unit: "%" },
        calculate: (vals, isDe) => {
          const result = (vals.beschaeftigte / vals.erwerbsfaehige) * 100;
          return {
            result,
            steps: [
              isDe ? "Beschäftigtenquote = Beschäftigte / Bevölkerung im erwerbsfähigen Alter × 100" : "Employment rate = Employed / working-age population × 100",
              `= ${fmt(vals.beschaeftigte, 0)} / ${fmt(vals.erwerbsfaehige, 0)} × 100`,
              `= ${fmt(result / 100, 4)} × 100`,
              `= ${fmt(result, 2)}%`
            ]
          };
        }
      },
      {
        id: "arbeitslosenquote",
        section: "arbeitsmarkt",
        name: { de: "Arbeitslosenquote", en: "Unemployment rate" },
        description: { de: "Anteil der Arbeitslosen an den Erwerbspersonen.", en: "Share of unemployed people in the labour force." },
        type: "formula",
        formula: { de: "Arbeitslose / Erwerbspersonen × 100", en: "Unemployed / labour force × 100" },
        unit: "%",
        higherIsBetter: false,
        tolerance: 1.0,
        inputs: [
          { id: "arbeitslose", source: "arbeitslose", name: { de: "Arbeitslose", en: "Unemployed" }, explanation: { de: "Anzahl der Arbeitslosen.", en: "Number of unemployed persons." }, min: 0 },
          { id: "beschaeftigte", source: null, name: { de: "Beschäftigte", en: "Employed" }, explanation: { de: "Anzahl der Beschäftigten. Erwerbspersonen = Beschäftigte + Arbeitslose.", en: "Number of employed persons. Labour force = employed + unemployed." }, min: 0 }
        ],
        officialComparison: null,
        info: { de: "Die Arbeitslosenquote wird auf Basis der Erwerbspersonen berechnet, nicht auf Basis der Gesamtbevölkerung. Erwerbspersonen = Beschäftigte + Arbeitslose.", en: "The unemployment rate is calculated using the labour force, not the total population. Labour force = employed + unemployed." },
        calculate: (vals, isDe) => {
          const erwerbspersonen = vals.beschaeftigte + vals.arbeitslose;
          const result = (vals.arbeitslose / erwerbspersonen) * 100;
          return {
            result,
            steps: [
              isDe ? "Erwerbspersonen = Beschäftigte + Arbeitslose" : "Labour force = employed + unemployed",
              `= ${fmt(vals.beschaeftigte, 0)} + ${fmt(vals.arbeitslose, 0)} = ${fmt(erwerbspersonen, 0)}`,
              isDe ? "Arbeitslosenquote = Arbeitslose / Erwerbspersonen × 100" : "Unemployment rate = unemployed / labour force × 100",
              `= ${fmt(vals.arbeitslose, 0)} / ${fmt(erwerbspersonen, 0)} × 100`,
              `= ${fmt(result, 2)}%`
            ]
          };
        }
      },
      {
        id: "arbeitslose_pro_1000",
        section: "arbeitsmarkt",
        name: { de: "Arbeitslose je 1.000 Einwohner", en: "Unemployed per 1,000 inhabitants" },
        description: { de: "Anzahl der Arbeitslosen bezogen auf 1.000 Einwohner.", en: "Number of unemployed persons per 1,000 inhabitants." },
        type: "rate",
        formula: { de: "Arbeitslose / Bevölkerung × 1.000", en: "Unemployed / population × 1,000" },
        unit: { de: "je 1.000 EW", en: "per 1,000 inh." },
        higherIsBetter: false,
        tolerance: 0.5,
        inputs: [
          { id: "arbeitslose", source: "arbeitslose", name: { de: "Arbeitslose", en: "Unemployed" }, explanation: { de: "Anzahl der Arbeitslosen.", en: "Number of unemployed persons." }, min: 0 },
          { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung", en: "Population" }, explanation: { de: "Gesamtbevölkerung.", en: "Total population." }, min: 0 }
        ],
        officialComparison: null,
        calculate: (vals, isDe) => {
          const result = (vals.arbeitslose / vals.bevoelkerung) * 1000;
          return {
            result,
            steps: [
              isDe ? "Arbeitslose je 1.000 EW = Arbeitslose / Bevölkerung × 1.000" : "Unemployed per 1,000 inh. = unemployed / population × 1,000",
              `= ${fmt(vals.arbeitslose, 0)} / ${fmt(vals.bevoelkerung, 0)} × 1.000`,
              `= ${fmt(result, 2)}`
            ]
          };
        }
      },
      {
        id: "anteil_minijobs",
        section: "arbeitsmarkt",
        name: { de: "Anteil Minijobs", en: "Share of mini-jobs" },
        description: { de: "Anteil der Beschäftigten in geringfügiger Beschäftigung.", en: "Share of employees in marginal employment." },
        type: "formula",
        formula: { de: "Minijob-Beschäftigte / Alle Beschäftigten × 100", en: "Mini-job employees / all employed × 100" },
        unit: "%",
        higherIsBetter: false,
        tolerance: 1.0,
        inputs: [
          { id: "minijobs", source: null, name: { de: "Minijob-Beschäftigte", en: "Mini-job employees" }, explanation: { de: "Anzahl der Minijob-Beschäftigten (nicht in CSV vorhanden).", en: "Number of mini-job employees (not available in CSV)." }, min: 0 },
          { id: "beschaeftigte", source: null, name: { de: "Beschäftigte", en: "Employed" }, explanation: { de: "Anzahl aller Beschäftigten.", en: "Number of all employed persons." }, min: 0 }
        ],
        officialComparison: { indicatorId: "anteil_minijobs", unit: "%" },
        info: { de: "Der CSV-Wert 'Anteil Minijobs' ist bereits als Prozentsatz vorhanden. Hier können Sie die zugrunde liegenden absoluten Zahlen eingeben.", en: "The CSV value 'Share of mini-jobs' is already available as a percentage. Here you can enter the underlying absolute numbers." },
        calculate: (vals, isDe) => {
          const result = (vals.minijobs / vals.beschaeftigte) * 100;
          return {
            result,
            steps: [
              isDe ? "Anteil Minijobs = Minijob-Beschäftigte / Beschäftigte × 100" : "Share of mini-jobs = mini-job employees / employed × 100",
              `= ${fmt(vals.minijobs, 0)} / ${fmt(vals.beschaeftigte, 0)} × 100`,
              `= ${fmt(result, 2)}%`
            ]
          };
        }
      },
      // C. Kaufkraft
      {
        id: "kaufkraft_pro_ew",
        section: "kaufkraft",
        name: { de: "Kaufkraft je Einwohner", en: "Purchasing power per inhabitant" },
        description: { de: "Verfügbares Einkommen der Kommune dividiert durch die Bevölkerung.", en: "Disposable income of the municipality divided by population." },
        type: "formula",
        formula: { de: "verfügbares Einkommen / Bevölkerung", en: "disposable income / population" },
        unit: "EUR/EW",
        higherIsBetter: true,
        tolerance: 100000,
        inputs: [
          { id: "einkommen", source: "kaufkraft", name: { de: "verfügbares Einkommen", en: "disposable income" }, explanation: { de: "Verfügbares Einkommen (vom CSV-Wert 'Kaufkraft' übernommen).", en: "Disposable income (prefilled from CSV value 'Kaufkraft')." }, min: 0 },
          { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung", en: "Population" }, explanation: { de: "Gesamtbevölkerung.", en: "Total population." }, min: 0 }
        ],
        officialComparison: { indicatorId: "kaufkraft", unit: "EUR/EW" },
        info: { de: "Hinweis: Die CSV-Spalte 'Kaufkraft' ist bereits als Pro-Kopf-Wert hinterlegt. Sie können die Eingabe anpassen, um Szenarien zu berechnen.", en: "Note: The CSV column 'Kaufkraft' is already stored as a per-capita value. You can adjust the input to calculate scenarios." },
        calculate: (vals, isDe) => {
          const result = vals.einkommen / vals.bevoelkerung;
          return {
            result,
            steps: [
              isDe ? "Kaufkraft je Einwohner = verfügbares Einkommen / Bevölkerung" : "Purchasing power per inhabitant = disposable income / population",
              `= ${fmt(vals.einkommen, 2)} / ${fmt(vals.bevoelkerung, 0)}`,
              `= ${fmt(result, 2)} EUR/EW`
            ]
          };
        }
      },
      // D. Gesundheit
      {
        id: "hausaerzte",
        section: "gesundheit",
        name: { de: "Hausärzte", en: "General practitioners" },
        description: { de: "Anzahl der Hausärzte in der Kommune.", en: "Number of general practitioners in the municipality." },
        type: "display",
        formula: { de: "Anzahl der Hausärzte", en: "Number of general practitioners" },
        unit: "Anzahl",
        input: { id: "hausaerzte", source: "hausaerzte", name: { de: "Hausärzte", en: "General practitioners" }, explanation: { de: "Anzahl der Hausärzte.", en: "Number of GPs." } },
        officialComparison: { indicatorId: "hausaerzte", unit: "Anzahl" }
      },
      {
        id: "hausaerzte_pro_10000",
        section: "gesundheit",
        name: { de: "Hausärzte je 10.000 Einwohner", en: "General practitioners per 10,000 inhabitants" },
        description: { de: "Anzahl der Hausärzte bezogen auf 10.000 Einwohner.", en: "Number of GPs per 10,000 inhabitants." },
        type: "rate",
        formula: { de: "Hausärzte / Bevölkerung × 10.000", en: "GPs / population × 10,000" },
        unit: { de: "je 10.000 EW", en: "per 10,000 inh." },
        higherIsBetter: true,
        tolerance: 0.5,
        inputs: [
          { id: "hausaerzte", source: "hausaerzte", name: { de: "Hausärzte", en: "General practitioners" }, explanation: { de: "Anzahl der Hausärzte.", en: "Number of GPs." }, min: 0 },
          { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung", en: "Population" }, explanation: { de: "Gesamtbevölkerung.", en: "Total population." }, min: 0 }
        ],
        officialComparison: null,
        calculate: (vals, isDe) => {
          const result = (vals.hausaerzte / vals.bevoelkerung) * 10000;
          return {
            result,
            steps: [
              isDe ? "Hausärzte je 10.000 EW = Hausärzte / Bevölkerung × 10.000" : "GPs per 10,000 inh. = GPs / population × 10,000",
              `= ${fmt(vals.hausaerzte, 0)} / ${fmt(vals.bevoelkerung, 0)} × 10.000`,
              `= ${fmt(result, 2)}`
            ]
          };
        }
      },
      {
        id: "kinderaerzte",
        section: "gesundheit",
        name: { de: "Kinderärzte", en: "Paediatricians" },
        description: { de: "Anzahl der Kinderärzte in der Kommune.", en: "Number of paediatricians in the municipality." },
        type: "display",
        formula: { de: "Anzahl der Kinderärzte", en: "Number of paediatricians" },
        unit: "Anzahl",
        input: { id: "kinderaerzte", source: "kinderaerzte", name: { de: "Kinderärzte", en: "Paediatricians" }, explanation: { de: "Anzahl der Kinderärzte.", en: "Number of paediatricians." } },
        officialComparison: { indicatorId: "kinderaerzte", unit: "Anzahl" }
      },
      {
        id: "kinderaerzte_pro_10000",
        section: "gesundheit",
        name: { de: "Kinderärzte je 10.000 Einwohner", en: "Paediatricians per 10,000 inhabitants" },
        description: { de: "Anzahl der Kinderärzte bezogen auf 10.000 Einwohner.", en: "Number of paediatricians per 10,000 inhabitants." },
        type: "rate",
        formula: { de: "Kinderärzte / Bevölkerung × 10.000", en: "Paediatricians / population × 10,000" },
        unit: { de: "je 10.000 EW", en: "per 10,000 inh." },
        higherIsBetter: true,
        tolerance: 0.5,
        inputs: [
          { id: "kinderaerzte", source: "kinderaerzte", name: { de: "Kinderärzte", en: "Paediatricians" }, explanation: { de: "Anzahl der Kinderärzte.", en: "Number of paediatricians." }, min: 0 },
          { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung", en: "Population" }, explanation: { de: "Gesamtbevölkerung.", en: "Total population." }, min: 0 }
        ],
        officialComparison: null,
        calculate: (vals, isDe) => {
          const result = (vals.kinderaerzte / vals.bevoelkerung) * 10000;
          return {
            result,
            steps: [
              isDe ? "Kinderärzte je 10.000 EW = Kinderärzte / Bevölkerung × 10.000" : "Paediatricians per 10,000 inh. = paediatricians / population × 10,000",
              `= ${fmt(vals.kinderaerzte, 0)} / ${fmt(vals.bevoelkerung, 0)} × 10.000`,
              `= ${fmt(result, 2)}`
            ]
          };
        }
      },
      {
        id: "aerzte_score",
        section: "gesundheit",
        name: { de: "Ärzte-Gesamtscore", en: "Physicians overall score" },
        description: { de: "Gewichteter Durchschnitt der normalisierten Hausarzt- und Kinderarzt-Werte.", en: "Weighted average of normalized GP and paediatrician values." },
        type: "composite",
        formula: { de: "Σ(Score_i × Gewicht_i) / Σ(Gewichte)", en: "Σ(Score_i × Weight_i) / Σ(Weights)" },
        unit: "Punkte",
        higherIsBetter: true,
        tolerance: 5.0,
        subIndicators: [
          { id: "hausaerzte", name: { de: "Hausärzte", en: "General practitioners" }, source: "hausaerzte", weight: 0.5, higherIsBetter: true, unit: "Anzahl" },
          { id: "kinderaerzte", name: { de: "Kinderärzte", en: "Paediatricians" }, source: "kinderaerzte", weight: 0.5, higherIsBetter: true, unit: "Anzahl" }
        ],
        officialComparison: null
      },
      // E. Daseinsvorsorge
      {
        id: "ent_hausarzt",
        section: "daseinsvorsorge",
        name: { de: "Entfernung zum Hausarzt", en: "Distance to GP" },
        description: { de: "Durchschnittliche Entfernung zum nächsten Hausarzt. Niedrigere Werte sind besser.", en: "Average distance to the nearest GP. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "ent_hausarzt", source: "ent_hausarzt", name: { de: "Entfernung zum Hausarzt", en: "Distance to GP" }, explanation: { de: "Durchschnittliche Entfernung in Metern.", en: "Average distance in meters." }, unit: "m" },
        officialComparison: { indicatorId: "ent_hausarzt", unit: "m" },
        tolerance: 10
      },
      {
        id: "ent_apo",
        section: "daseinsvorsorge",
        name: { de: "Entfernung zur Apotheke", en: "Distance to pharmacy" },
        description: { de: "Durchschnittliche Entfernung zur nächsten Apotheke. Niedrigere Werte sind besser.", en: "Average distance to the nearest pharmacy. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "ent_apo", source: "ent_apo", name: { de: "Entfernung zur Apotheke", en: "Distance to pharmacy" }, explanation: { de: "Durchschnittliche Entfernung in Metern.", en: "Average distance in meters." }, unit: "m" },
        officialComparison: { indicatorId: "ent_apo", unit: "m" },
        tolerance: 10
      },
      {
        id: "ent_super",
        section: "daseinsvorsorge",
        name: { de: "Entfernung zum Supermarkt", en: "Distance to supermarket" },
        description: { de: "Durchschnittliche Entfernung zum nächsten Supermarkt. Niedrigere Werte sind besser.", en: "Average distance to the nearest supermarket. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "ent_super", source: "ent_super", name: { de: "Entfernung zum Supermarkt", en: "Distance to supermarket" }, explanation: { de: "Durchschnittliche Entfernung in Metern.", en: "Average distance in meters." }, unit: "m" },
        officialComparison: { indicatorId: "ent_super", unit: "m" },
        tolerance: 10
      },
      {
        id: "ent_grund",
        section: "daseinsvorsorge",
        name: { de: "Entfernung zur Grundschule", en: "Distance to primary school" },
        description: { de: "Durchschnittliche Entfernung zur nächsten Grundschule. Niedrigere Werte sind besser.", en: "Average distance to the nearest primary school. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "ent_grund", source: "ent_grund", name: { de: "Entfernung zur Grundschule", en: "Distance to primary school" }, explanation: { de: "Durchschnittliche Entfernung in Metern.", en: "Average distance in meters." }, unit: "m" },
        officialComparison: { indicatorId: "ent_grund", unit: "m" },
        tolerance: 10
      },
      {
        id: "ent_oev",
        section: "daseinsvorsorge",
        name: { de: "Entfernung zur ÖPNV-Haltestelle", en: "Distance to public transport" },
        description: { de: "Durchschnittliche Entfernung zur nächsten ÖPNV-Haltestelle. Niedrigere Werte sind besser.", en: "Average distance to the nearest public transport stop. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "ent_oev", source: "ent_oev", name: { de: "Entfernung zur ÖPNV-Haltestelle", en: "Distance to public transport" }, explanation: { de: "Durchschnittliche Entfernung in Metern.", en: "Average distance in meters." }, unit: "m" },
        officialComparison: { indicatorId: "ent_oev", unit: "m" },
        tolerance: 10
      },
      {
        id: "daseinsvorsorge_score",
        section: "daseinsvorsorge",
        name: { de: "Daseinsvorsorge-Gesamtscore", en: "Public services overall score" },
        description: { de: "Gewichteter Durchschnitt aller Daseinsvorsorge-Indikatoren. Niedrigere Entfernungen ergeben höhere Scores.", en: "Weighted average of all public-service indicators. Lower distances yield higher scores." },
        type: "composite",
        formula: { de: "Σ(Score_i × Gewicht_i) / Σ(Gewichte)", en: "Σ(Score_i × Weight_i) / Σ(Weights)" },
        unit: "Punkte",
        higherIsBetter: true,
        tolerance: 5.0,
        subIndicators: [
          { id: "hausaerzte", name: { de: "Hausärzte", en: "General practitioners" }, source: "hausaerzte", weight: 0.15, higherIsBetter: true, unit: "Anzahl" },
          { id: "kinderaerzte", name: { de: "Kinderärzte", en: "Paediatricians" }, source: "kinderaerzte", weight: 0.10, higherIsBetter: true, unit: "Anzahl" },
          { id: "ent_hausarzt", name: { de: "Entfernung Hausarzt", en: "Distance to GP" }, source: "ent_hausarzt", weight: 0.15, higherIsBetter: false, unit: "m" },
          { id: "ent_apo", name: { de: "Entfernung Apotheke", en: "Distance to pharmacy" }, source: "ent_apo", weight: 0.15, higherIsBetter: false, unit: "m" },
          { id: "ent_super", name: { de: "Entfernung Supermarkt", en: "Distance to supermarket" }, source: "ent_super", weight: 0.15, higherIsBetter: false, unit: "m" },
          { id: "ent_grund", name: { de: "Entfernung Grundschule", en: "Distance to primary school" }, source: "ent_grund", weight: 0.15, higherIsBetter: false, unit: "m" },
          { id: "ent_oev", name: { de: "Entfernung ÖPNV", en: "Distance to public transport" }, source: "ent_oev", weight: 0.15, higherIsBetter: false, unit: "m" }
        ],
        officialComparison: { indicatorId: "ent_oev", unit: "m" }
      },
      // F. Festnetz
      {
        id: "breitband_100",
        section: "festnetz",
        name: { de: "Bandbreite ≥100 Mbit/s", en: "Bandwidth ≥100 Mbit/s" },
        description: { de: "Anteil der Haushalte mit mindestens 100 Mbit/s Bandbreite.", en: "Share of households with at least 100 Mbit/s bandwidth." },
        type: "display",
        formula: { de: "Haushalte ≥100 Mbit/s / Gesamthaushalte × 100", en: "Households ≥100 Mbit/s / total households × 100" },
        unit: "%",
        input: { id: "breitband_100", source: "breitband_100", name: { de: "Bandbreite ≥100 Mbit/s", en: "Bandwidth ≥100 Mbit/s" }, explanation: { de: "Anteil in Prozent (bereits aus CSV vorhanden).", en: "Share in percent (already available in CSV)." } },
        officialComparison: { indicatorId: "breitband_100", unit: "%" },
        info: { de: "Der CSV-Wert ist bereits als Prozentsatz vorhanden. Eine Berechnung aus Einzelhaushalten ist nicht möglich.", en: "The CSV value is already available as a percentage. Calculation from individual households is not possible." }
      },
      {
        id: "festnetz_download",
        section: "festnetz",
        name: { de: "Durchschnittliche Festnetzgeschwindigkeit", en: "Average fixed-network speed" },
        description: { de: "Mittlere Downloadgeschwindigkeit im Festnetz.", en: "Average fixed-network download speed." },
        type: "display",
        formula: { de: "Mittelwert Festnetzempfang (Download)", en: "Average fixed-network reception (download)" },
        unit: "Mbit/s",
        input: { id: "festnetz_download", source: "festnetz_download", name: { de: "Durchschnittliche Geschwindigkeit", en: "Average speed" }, explanation: { de: "Mittlere Downloadgeschwindigkeit.", en: "Average download speed." } },
        officialComparison: { indicatorId: "festnetz_download", unit: "Mbit/s" }
      },
      {
        id: "festnetz_score",
        section: "festnetz",
        name: { de: "Festnetz-Gesamtscore", en: "Fixed-network overall score" },
        description: { de: "Gewichteter Durchschnitt der Festnetz-Indikatoren.", en: "Weighted average of fixed-network indicators." },
        type: "composite",
        formula: { de: "Σ(Score_i × Gewicht_i) / Σ(Gewichte)", en: "Σ(Score_i × Weight_i) / Σ(Weights)" },
        unit: "Punkte",
        higherIsBetter: true,
        tolerance: 5.0,
        subIndicators: [
          { id: "breitband_100", name: { de: "Bandbreite ≥100 Mbit/s", en: "Bandwidth ≥100 Mbit/s" }, source: "breitband_100", weight: 0.5, higherIsBetter: true, unit: "%" },
          { id: "festnetz_download", name: { de: "Durchschnittliche Geschwindigkeit", en: "Average speed" }, source: "festnetz_download", weight: 0.5, higherIsBetter: true, unit: "Mbit/s" }
        ],
        officialComparison: null
      },
      // G. Mobilität & Sicherheit
      {
        id: "strassen_unfaelle",
        section: "mobilitaet",
        name: { de: "Verkehrsunfälle", en: "Traffic accidents" },
        description: { de: "Anzahl der Straßenverkehrsunfälle.", en: "Number of road traffic accidents." },
        type: "display",
        formula: { de: "Anzahl der Straßenverkehrsunfälle", en: "Number of road traffic accidents" },
        unit: "Anzahl",
        input: { id: "strassen_unfaelle", source: "strassen_unfaelle", name: { de: "Verkehrsunfälle", en: "Traffic accidents" }, explanation: { de: "Anzahl der Unfälle.", en: "Number of accidents." } },
        officialComparison: { indicatorId: "strassen_unfaelle", unit: "Anzahl" }
      },
      {
        id: "unfaelle_pro_1000",
        section: "mobilitaet",
        name: { de: "Verkehrsunfälle je 1.000 Einwohner", en: "Traffic accidents per 1,000 inhabitants" },
        description: { de: "Anzahl der Verkehrsunfälle bezogen auf 1.000 Einwohner.", en: "Number of traffic accidents per 1,000 inhabitants." },
        type: "rate",
        formula: { de: "Verkehrsunfälle / Bevölkerung × 1.000", en: "Traffic accidents / population × 1,000" },
        unit: { de: "je 1.000 EW", en: "per 1,000 inh." },
        higherIsBetter: false,
        tolerance: 0.5,
        inputs: [
          { id: "strassen_unfaelle", source: "strassen_unfaelle", name: { de: "Verkehrsunfälle", en: "Traffic accidents" }, explanation: { de: "Anzahl der Unfälle.", en: "Number of accidents." }, min: 0 },
          { id: "bevoelkerung", source: "bevoelkerung", name: { de: "Bevölkerung", en: "Population" }, explanation: { de: "Gesamtbevölkerung.", en: "Total population." }, min: 0 }
        ],
        officialComparison: null,
        calculate: (vals, isDe) => {
          const result = (vals.strassen_unfaelle / vals.bevoelkerung) * 1000;
          return {
            result,
            steps: [
              isDe ? "Unfälle je 1.000 EW = Unfälle / Bevölkerung × 1.000" : "Accidents per 1,000 inh. = accidents / population × 1,000",
              `= ${fmt(vals.strassen_unfaelle, 0)} / ${fmt(vals.bevoelkerung, 0)} × 1.000`,
              `= ${fmt(result, 2)}`
            ]
          };
        }
      },
      {
        id: "erreichbarkeit_autobahn",
        section: "mobilitaet",
        name: { de: "Erreichbarkeit Autobahn", en: "Accessibility of motorway" },
        description: { de: "Durchschnittliche Reisezeit zur nächsten Autobahnanschlussstelle. Niedrigere Werte sind besser.", en: "Average travel time to nearest motorway junction. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "erreichbarkeit_autobahn", source: "erreichbarkeit_autobahn", name: { de: "Erreichbarkeit Autobahn", en: "Accessibility of motorway" }, explanation: { de: "Durchschnittliche Reisezeit in Minuten.", en: "Average travel time in minutes." }, unit: "min" },
        officialComparison: { indicatorId: "erreichbarkeit_autobahn", unit: "min" },
        tolerance: 10
      },
      {
        id: "erreichbarkeit_flughafen",
        section: "mobilitaet",
        name: { de: "Erreichbarkeit Flughafen", en: "Accessibility of airport" },
        description: { de: "Durchschnittliche Reisezeit zum nächsten Flughafen. Niedrigere Werte sind besser.", en: "Average travel time to nearest airport. Lower values are better." },
        type: "normalized",
        formula: { de: "(Max − Wert) / (Max − Min) × 100", en: "(Max − Value) / (Max − Min) × 100" },
        unit: "%",
        higherIsBetter: false,
        input: { id: "erreichbarkeit_flughafen", source: "erreichbarkeit_flughafen", name: { de: "Erreichbarkeit Flughafen", en: "Accessibility of airport" }, explanation: { de: "Durchschnittliche Reisezeit in Minuten.", en: "Average travel time in minutes." }, unit: "min" },
        officialComparison: { indicatorId: "erreichbarkeit_flughafen", unit: "min" },
        tolerance: 10
      }
    ];

    const KpiCalculator = () => {
      const { t } = useT();
      const isDe = currentLang === "de";
      const [municipalityId, setMunicipalityId] = useState("");
      const [inputs, setInputs] = useState({});
      const [results, setResults] = useState({});
      const [errors, setErrors] = useState({});
      const [weights, setWeights] = useState({});
      const [expandedSections, setExpandedSections] = useState({ daseinsvorsorge: true });

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
        } catch (e) {
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
        window.location.hash = "#/methodology";
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

    const MapsPage = () => {
      const { t } = useT();
      return (
        <div>
          <h1 className="text-3xl font-bold text-ink mb-6">{t("maps")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENCHMARK_DATA.municipalities.map(m => {
              if (!m || !m.id) return null;
              return (
                <Link key={m.id} to={`/municipality/${m.id}`} className="block bg-white rounded-2xl p-4 card-shadow border border-gray-100 hover:shadow-lg transition">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
                    <h3 className="font-bold text-ink">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</h3>
                  </div>
                  <MunicipalityMap municipality={m} height="250px" />
                </Link>
              );
            })}
          </div>
        </div>
      );
    };

    const MunicipalitiesPage = ({ scores }) => {
      const { t } = useT();
      return (
        <div>
          <h1 className="text-3xl font-bold text-ink mb-6">{t("municipalities")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENCHMARK_DATA.municipalities.map(m => {
              if (!m || !m.id) return null;
              const ov = scores && scores[m.id] ? scores[m.id].overall : null;
              return (
                <Link key={m.id} to={`/municipality/${m.id}`} className="flex items-center gap-4 bg-white rounded-2xl p-5 card-shadow border border-gray-100 hover:shadow-lg transition">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-ink text-lg">{m.name && m.name[currentLang] ? m.name[currentLang] : m.id}</h3>
                    <div className="text-sm text-muted mb-1">{m.kreis || ""}</div>
                    <div className="text-sm text-gray-600">{m.description && m.description[currentLang] ? m.description[currentLang] : ""}</div>
                  </div>
                  <ScoreRing score={ov} size={60} stroke={5} />
                </Link>
              );
            })}
          </div>
        </div>
      );
    };

    const MunicipalityDetail = ({ scores, setModal, stakeholder, setStakeholder }) => {
      const { id } = useParams();
      const m = BENCHMARK_DATA.municipalities.find(x => x.id === id);
      const { t } = useT();
      const isDe = currentLang === "de";
      const stakeholderObj = BENCHMARK_DATA.stakeholders[stakeholder];
      if (!m || !m.id) return <div className="text-center py-20">{t("noData")}</div>;
      const sc = scores && scores[m.id] ? scores[m.id] : {};
      const kpisArr = BENCHMARK_DATA.kpis.map(k => ({ id: k.id, name: k.name[currentLang], score: sc.kpis ? sc.kpis[k.id] : null }));
      const best = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>b.score-a.score)[0];
      const worst = kpisArr.filter(k=>k.score!==null && k.score!==undefined).sort((a,b)=>a.score-b.score)[0];
      const priorityKpis = stakeholderObj.focus;
      const prioritySubIds = stakeholderObj.priorityIndicators;
      return (
        <div>
          <div className="premium-gradient rounded-3xl p-8 md:p-12 text-white mb-8 hero-pattern relative overflow-hidden">
            <div className="relative z-10 max-w-4xl">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-4xl glass-card" style={{ background: m.color || "#064E3B" }}>{m.name && m.name[currentLang] ? m.name[currentLang][0] : "?"}</div>
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{m.name && m.name[currentLang] ? m.name[currentLang] : (m.id || "-")}</h1>
                  <div className="text-emerald-100 text-lg">{m.kreis || ""} · {fmt(m.population)} EW</div>
                </div>
                <div className="glass-card rounded-2xl p-5 flex flex-col items-center">
                  <div className="text-sm text-emerald-100 mb-1">{t("overallScore")}</div>
                  <ScoreRing score={sc.overall} size={100} stroke={10} />
                  <div className="mt-2 font-semibold">{sc.completeness !== undefined ? sc.completeness + "%" : "-"} {t("dataCompleteness")}</div>
                </div>
              </div>
            </div>
          </div>

          <StakeholderSelector stakeholder={stakeholder} setStakeholder={setStakeholder} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <MunicipalityMap municipality={m} height="450px" />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
                <h3 className="font-bold text-ink mb-3">{isDe ? "Kommunalprofil" : "Municipality Profile"}</h3>
                <div className="space-y-2 text-sm">
                  {BENCHMARK_DATA.profileIndicators.map(pi => {
                    const pv = BENCHMARK_DATA.values && BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id].profile ? BENCHMARK_DATA.values[m.id].profile[pi.id] : null;
                    return (
                      <div key={pi.id} className="flex justify-between">
                        <span className="text-gray-500">{pi.name[currentLang]}</span>
                        <span className="font-mono font-medium">{pv && pv.raw !== null && pv.raw !== undefined ? fmt(pv.raw, pi.unit === "EUR/EW" ? 2 : 1) + " " + pv.unit : "-"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 card-shadow border border-gray-100">
                <h3 className="font-bold text-ink mb-3">{isDe ? "Stärken & Schwächen" : "Strengths & Weaknesses"}</h3>
                {best && <div className="mb-2"><span className="text-sm text-gray-500">{t("strongestKpi")}:</span> <span className="font-medium text-good">{best.name} {best.score}%</span></div>}
                {worst && <div><span className="text-sm text-gray-500">{t("weakestKpi")}:</span> <span className="font-medium text-low">{worst.name} {worst.score}%</span></div>}
              </div>
              <ExportButtons municipalityIds={[m.id]} stakeholderId={stakeholder} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-ink mb-4">{isDe ? "KPI-Übersicht" : "KPI Overview"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {BENCHMARK_DATA.kpis.map(kpi => {
              const score = sc.kpis ? sc.kpis[kpi.id] : null;
              const v = BENCHMARK_DATA.values && BENCHMARK_DATA.values[m.id] && BENCHMARK_DATA.values[m.id][kpi.id] ? BENCHMARK_DATA.values[m.id][kpi.id] : { sub: {} };
              const isPriority = priorityKpis.includes(kpi.id);
              return (
                <div key={kpi.id} className={`bg-white rounded-2xl p-5 card-shadow border ${isPriority ? "border-forest/30 ring-1 ring-forest/10" : "border-gray-100"}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-ink">{kpi.name[currentLang]}</h3>
                      {isPriority && <span className="text-xs px-2 py-0.5 rounded bg-forest/10 text-forest font-medium">{isDe ? "Fokus" : "Focus"}</span>}
                    </div>
                    <TrafficLight score={score} thresholds={kpi.thresholds} showLabel={false} />
                  </div>
                  <div className="space-y-1 text-sm mb-3">
                    {kpi.subIndicators.map(sub => {
                      const sv = v.sub[sub.id];
                      const isPrioritySub = prioritySubIds.includes(sub.id);
                      return (
                        <div key={sub.id} className={`flex justify-between p-1 rounded ${isPrioritySub ? "bg-emerald-50/50" : ""}`}>
                          <span className="text-gray-500">{sub.name[currentLang] || sub.name}</span>
                          <span className="font-mono">{sv.raw !== null && sv.raw !== undefined ? fmt(sv.raw, 2) + " " + sv.unit : <span className="text-gray-400 italic">{t("noData")}</span>}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={()=>setModal({ kpi, municipality: m })} className="text-sm text-forest hover:underline">{t("howCalculated")}</button>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-ink mb-4">{isDe ? "Vergleich mit anderen Kommunen" : "Comparison with other municipalities"}</h2>
            <div className="space-y-3">
              {BENCHMARK_DATA.kpis.map(kpi => {
                const sorted = [...BENCHMARK_DATA.municipalities].sort((a,b) => {
                  const av = scores && scores[a.id] && scores[a.id].kpis ? scores[a.id].kpis[kpi.id] : null;
                  const bv = scores && scores[b.id] && scores[b.id].kpis ? scores[b.id].kpis[kpi.id] : null;
                  return (bv||0) - (av||0);
                });
                const rank = sorted.findIndex(x => x.id === m.id) + 1;
                const score = sc.kpis ? sc.kpis[kpi.id] : null;
                return (
                  <div key={kpi.id} className="flex items-center justify-between p-3 rounded-xl bg-paper">
                    <span className="font-medium">{kpi.name[currentLang]}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted">{isDe ? "Platz" : "Rank"} {rank} / {sorted.length}</span>
                      <span className="font-bold" style={{ color: statusInfo(score, kpi.thresholds).color }}>{score !== null && score !== undefined ? score + "%" : "-"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    const DataPage = () => {
      const isDe = currentLang === "de";
      return (
        <div>
          <h1 className="text-3xl font-bold text-ink mb-4">{TRANSLATIONS[currentLang].data}</h1>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
            <p className="text-gray-700 mb-4">{isDe ? "Rohdaten aus backend/data/csv/. CSV-Import-Assistent ist als UI-Platzhalter vorgesehen." : "Raw data from backend/data/csv/. CSV import wizard is planned as a UI placeholder."}</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">📁</div>
              <div className="font-medium">{isDe ? "CSV-Datei hier ablegen" : "Drop CSV file here"}</div>
              <div className="text-sm">{isDe ? "nur Südharz, Landsberg, Leuna, Teutschenthal" : "only Südharz, Landsberg, Leuna, Teutschenthal"}</div>
            </div>
          </div>
        </div>
      );
    };

    const ApiPage = () => {
      const isDe = currentLang === "de";
      return (
        <div>
          <h1 className="text-3xl font-bold text-ink mb-4">{TRANSLATIONS[currentLang].api}</h1>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 font-mono text-sm">
            <p className="text-gray-700 mb-2 font-sans">{isDe ? "Verfügbare Endpunkte:" : "Available endpoints:"}</p>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto whitespace-pre">
              {`GET /api/benchmark\\n{\\n  config: { ... },\\n  municipalities: [...],\\n  kpis: [...],\\n  profileIndicators: [...],\\n  stakeholders: { ... },\\n  values: { ... }\\n}`}
            </div>
          </div>
        </div>
      );
    };

    const AiPage = () => {
      const { t } = useT();
      const isDe = currentLang === "de";
      const [tab, setTab] = useState("chatgpt");
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState("");
      const suggestions = isDe ? [
        "Welche Kommune hat den besten Festnetz-Score?",
        "Vergleiche Mobilfunk in Leuna und Teutschenthal.",
        "Warum ist der Daseinsvorsorge-Score in Südharz niedriger?",
        "Erkläre die Formel für Digitale Services."
      ] : [
        "Which municipality has the best fixed-network score?",
        "Compare mobile network in Leuna and Teutschenthal.",
        "Why is the public-services score lower in Südharz?",
        "Explain the Digital Services formula."
      ];
      const answer = (q) => {
        const lower = q.toLowerCase();
        if (lower.includes("festnetz") && lower.includes("best")) return isDe ? "Südharz hat mit 93,66 % die höchste Abdeckung an Haushalten mit ≥100 Mbit/s (INKAR 2023)." : "Südharz has the highest household coverage of ≥100 Mbit/s at 93.66% (INKAR 2023).";
        if (lower.includes("leuna") && lower.includes("teutschenthal") && lower.includes("mobilfunk")) return isDe ? "Für Teutschenthal liegen keine Mobilfunk-Rohdaten vor. Leuna hat Werte für alle drei Netzbetreiber." : "No mobile raw data is available for Teutschenthal. Leuna has values for all three operators.";
        if (lower.includes("südharz") && lower.includes("daseinsvorsorge")) return isDe ? "Südharz hat die höchste Bandbreitenabdeckung, aber bei Entfernungen zu Ärzten und Supermärkten verbesserungswürdige Werte." : "Südharz has the highest broadband coverage, but distances to doctors and supermarkets show room for improvement.";
        if (lower.includes("digitale services") && lower.includes("formel")) return isDe ? "Der Score basiert auf dem OZG-Reifegradmodell (Stufen 0–4). Normalisierung: Durchschnittlicher Reifegrad / 4 × 100." : "The score is based on the OZG maturity model (levels 0–4). Normalization: average maturity level / 4 × 100.";
        if (lower.includes("best") || lower.includes("beste")) return isDe ? "Leuna erreicht den höchsten Gesamtscore, da für diese Kommune die meisten aktuellen Rohdaten vorliegen." : "Leuna achieves the highest overall score because the most recent raw data is available for this municipality.";
        if (lower.includes("fehl") || lower.includes("missing")) return isDe ? "Für Mobilfunk und Digitale Services liegen für Südharz und Teutschenthal keine Rohdaten vor." : "No raw data is available for mobile network and digital services for Südharz and Teutschenthal.";
        return isDe ? "Dies kann anhand der verfügbaren Daten nicht bestätigt werden." : "I cannot confirm this from the available data.";
      };
      const send = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", text: input }, { role: "ai", text: answer(input) }]);
        setInput("");
      };
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-ink">{t("ai")}</h1>
            <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium">{t("aiDemo")}</span>
          </div>
          <p className="text-gray-600 mb-6">{t("aiDemoNote")}</p>
          <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
            <div className="flex border-b">
              {["chatgpt", "claude", "gemini"].map(tn => (
                <button key={tn} onClick={()=>setTab(tn)} className={`flex-1 py-3 text-sm font-medium capitalize ${tab===tn ? "bg-forest text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{tn}</button>
              ))}
            </div>
            <div className="p-4 h-80 overflow-y-auto space-y-3 bg-paper/30">
              {messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-10">{isDe ? "Stellen Sie eine Frage zu den Daten." : "Ask a question about the data."}</div>}
              {messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl max-w-[80%] ${msg.role === "user" ? "bg-forest text-white ml-auto" : "bg-white border border-gray-100"}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2 mb-3 flex-wrap">
                {suggestions.map((s,i) => <button key={i} onClick={()=>{ setInput(s); setMessages([...messages, {role:"user",text:s}, {role:"ai",text:answer(s)}]); }} className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">{s}</button>)}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter" && send()} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder={isDe ? "Frage eingeben..." : "Type a question..."} />
                <button onClick={send} className="px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium">{isDe ? "Senden" : "Send"}</button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const KpiCatalogue = () => {
      const isDe = currentLang === "de";
      const [filter, setFilter] = useState("all");
      const cats = BENCHMARK_DATA.kpis;
      const indicators = BENCHMARK_DATA.indicatorCatalogue || [];
      const filtered = filter === "all" ? indicators : indicators.filter(ind => ind.category === filter);
      return (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-ink">{isDe ? "KPI-Katalog" : "KPI Catalogue"}</h1>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>setFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter==="all"?"bg-forest text-white":"bg-white border"}`}>{isDe ? "Alle" : "All"}</button>
              {cats.map(cat => <button key={cat.id} onClick={()=>setFilter(cat.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter===cat.id?"bg-forest text-white":"bg-white border"}`}>{cat.name[currentLang]}</button>)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
            <h2 className="font-semibold mb-2">{isDe ? "Methodik" : "Methodology"}</h2>
            <p className="text-sm text-gray-700 mb-2">{BENCHMARK_DATA.methodology.normalization[isDe ? "de" : "en"]}</p>
            <p className="text-sm text-gray-700">{isDe ? "Kategorie-Score = gewichteter Durchschnitt der zugehörigen Indikatoren." : "Category score = weighted average of the related indicators."}</p>
          </div>
          <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-paper">
                <tr>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "KPI" : "KPI"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Kategorie" : "Category"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Einheit" : "Unit"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Jahr" : "Year"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Quelle" : "Source"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Richtung" : "Direction"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Gewicht" : "Weight"}</th>
                  <th className="text-left p-4 font-semibold text-ink">{isDe ? "Formel" : "Formula"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ind => {
                  const cat = cats.find(c => c.id === ind.category);
                  return (
                    <tr key={ind.id} className="border-t border-gray-100">
                      <td className="p-4 align-top">
                        <div className="font-semibold text-ink">{ind.name[currentLang] || ind.name}</div>
                        <div className="text-xs text-muted max-w-xs">{ind.description ? (ind.description[currentLang] || ind.description) : ""}</div>
                      </td>
                      <td className="p-4 align-top">{cat ? cat.name[currentLang] : "-"}</td>
                      <td className="p-4 align-top font-mono">{ind.unit}</td>
                      <td className="p-4 align-top">{indicators.find(x=>x.id===ind.id) && BENCHMARK_DATA.values && BENCHMARK_DATA.values["landsberg"] && BENCHMARK_DATA.values["landsberg"][ind.category] && BENCHMARK_DATA.values["landsberg"][ind.category].sub && BENCHMARK_DATA.values["landsberg"][ind.category].sub[ind.id] ? (BENCHMARK_DATA.values["landsberg"][ind.category].sub[ind.id].date || "-") : "-"}</td>
                      <td className="p-4 align-top text-muted">{ind.source || "-"}</td>
                      <td className="p-4 align-top">{ind.higherIsBetter ? (isDe ? "Höher ist besser" : "Higher is better") : (isDe ? "Niedriger ist besser" : "Lower is better")}</td>
                      <td className="p-4 align-top">{fmt(ind.weight*100,1)}%</td>
                      <td className="p-4 align-top font-mono text-xs">{ind.formula}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const AuthFormCard = ({ title, children, footer }) => (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-100">
          <h1 className="text-2xl font-bold text-ink mb-6 text-center">{title}</h1>
          {children}
          {footer && <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>}
        </div>
      </div>
    );

    const LoginPage = () => {
      const isDe = currentLang === "de";
      const { login, user } = useAuth();
      const navigate = (path) => { window.location.hash = "#" + path; };
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [localError, setLocalError] = useState("");
      const [loading, setLoading] = useState(false);
      if (user) { navigate("/"); return null; }
      const submit = async (e) => {
        e.preventDefault();
        setLocalError("");
        if (!email || !password) { setLocalError(isDe ? "Email und Passwort erforderlich." : "Email and password required."); return; }
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) navigate("/");
        else setLocalError(res.error);
      };
      return (
        <AuthFormCard title={TRANSLATIONS[currentLang].login} footer={<Link to="/register" className="text-forest hover:underline">{isDe ? "Noch kein Konto? Registrieren" : "No account? Register"}</Link>}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="name@beispiel.de" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isDe ? "Passwort" : "Password"}</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            {localError && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{localError}</div>}
            <button type="submit" disabled={loading} className="w-full py-2 bg-forest text-white rounded-lg font-medium hover:bg-forest/90 disabled:opacity-50">{loading ? (isDe ? "Wird angemeldet..." : "Logging in...") : (isDe ? "Anmelden" : "Login")}</button>
          </form>
        </AuthFormCard>
      );
    };

    const RegisterPage = () => {
      const isDe = currentLang === "de";
      const { register, user } = useAuth();
      const navigate = (path) => { window.location.hash = "#" + path; };
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirm, setConfirm] = useState("");
      const [localError, setLocalError] = useState("");
      const [loading, setLoading] = useState(false);
      if (user) { navigate("/"); return null; }
      const submit = async (e) => {
        e.preventDefault();
        setLocalError("");
        if (!name || !email || !password) { setLocalError(isDe ? "Alle Felder sind erforderlich." : "All fields are required."); return; }
        if (password.length < 6) { setLocalError(isDe ? "Passwort muss mindestens 6 Zeichen haben." : "Password must be at least 6 characters."); return; }
        if (password !== confirm) { setLocalError(isDe ? "Passwörter stimmen nicht überein." : "Passwords do not match."); return; }
        setLoading(true);
        const res = await register(name, email, password, currentLang);
        setLoading(false);
        if (res.success) navigate("/");
        else setLocalError(res.error);
      };
      return (
        <AuthFormCard title={isDe ? "Registrieren" : "Register"} footer={<Link to="/login" className="text-forest hover:underline">{isDe ? "Bereits ein Konto? Anmelden" : "Already have an account? Login"}</Link>}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isDe ? "Name" : "Name"}</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isDe ? "Passwort" : "Password"}</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isDe ? "Passwort bestätigen" : "Confirm password"}</label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
            </div>
            {localError && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{localError}</div>}
            <button type="submit" disabled={loading} className="w-full py-2 bg-forest text-white rounded-lg font-medium hover:bg-forest/90 disabled:opacity-50">{loading ? (isDe ? "Wird registriert..." : "Registering...") : (isDe ? "Registrieren" : "Register")}</button>
          </form>
        </AuthFormCard>
      );
    };

    const ProfilePage = () => {
      const isDe = currentLang === "de";
      const { user, loading, logout, updateProfile } = useAuth();
      const navigate = (path) => { window.location.hash = "#" + path; };
      const [name, setName] = useState(user && user.name ? user.name : "");
      const [language, setLanguage] = useState(user && user.language ? user.language : currentLang);
      const [currentPwd, setCurrentPwd] = useState("");
      const [newPwd, setNewPwd] = useState("");
      const [confirmPwd, setConfirmPwd] = useState("");
      const [message, setMessage] = useState("");
      const [error, setError] = useState("");
      if (loading) return <div className="text-center py-20">{isDe ? "Laden..." : "Loading..."}</div>;
      if (!user) { navigate("/login"); return null; }
      const saveProfile = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");
        const res = await updateProfile({ name, language });
        if (res.success) setMessage(isDe ? "Profil aktualisiert." : "Profile updated.");
        else setError(res.error);
      };
      const changePassword = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");
        if (newPwd.length < 6) { setError(isDe ? "Passwort muss mindestens 6 Zeichen haben." : "Password must be at least 6 characters."); return; }
        if (newPwd !== confirmPwd) { setError(isDe ? "Passwörter stimmen nicht überein." : "Passwords do not match."); return; }
        const res = await apiFetch("/api/auth/change-password", { method: "PUT", body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }) });
        if (res.ok && res.data.success) {
          setMessage(isDe ? "Passwort geändert." : "Password changed.");
          setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
        } else {
          setError(res.data.errors ? res.data.errors.join(" ") : (isDe ? "Fehler." : "Error."));
        }
      };
      return (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-ink mb-6">{isDe ? "Profil" : "Profile"}</h1>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-ink mb-4">{isDe ? "Kontoinformationen" : "Account information"}</h2>
            <div className="space-y-2 text-sm mb-4">
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{user.email}</span></div>
              <div><span className="text-gray-500">{isDe ? "Rolle:" : "Role:"}</span> <span className="font-medium">{user.role}</span></div>
              <div><span className="text-gray-500">{isDe ? "Mitglied seit:" : "Member since:"}</span> <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span></div>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isDe ? "Name" : "Name"}</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isDe ? "Sprache" : "Language"}</label>
                <select value={language} onChange={e=>setLanguage(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              {message && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">{message}</div>}
              {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
              <button type="submit" className="px-4 py-2 bg-forest text-white rounded-lg font-medium hover:bg-forest/90">{isDe ? "Profil speichern" : "Save profile"}</button>
            </form>
          </div>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-ink mb-4">{isDe ? "Passwort ändern" : "Change password"}</h2>
            <form onSubmit={changePassword} className="space-y-4">
              <input type="password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} placeholder={isDe ? "Aktuelles Passwort" : "Current password"} className="w-full border rounded-lg px-3 py-2" required />
              <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder={isDe ? "Neues Passwort" : "New password"} className="w-full border rounded-lg px-3 py-2" required />
              <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder={isDe ? "Neues Passwort bestätigen" : "Confirm new password"} className="w-full border rounded-lg px-3 py-2" required />
              <button type="submit" className="px-4 py-2 bg-navy text-white rounded-lg font-medium hover:bg-navy/90">{isDe ? "Passwort ändern" : "Change password"}</button>
            </form>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="w-full py-2 border-2 border-low text-low rounded-lg font-medium hover:bg-red-50">{TRANSLATIONS[currentLang].logout}</button>
        </div>
      );
    };

    const computeScores = (indicatorWeights, categoryWeights) => {
      // With default weights, use the precomputed scores from the backend data.
      const hasCustomInd = indicatorWeights && Object.keys(indicatorWeights).length > 0;
      const hasCustomCat = categoryWeights && Object.keys(categoryWeights).length > 0;
      if (!hasCustomInd && !hasCustomCat) {
        return JSON.parse(JSON.stringify(BENCHMARK_DATA.values));
      }
      const scores = JSON.parse(JSON.stringify(BENCHMARK_DATA.values));
      for (const m of BENCHMARK_DATA.municipalities) {
        const mid = m.id;
        scores[mid].kpis = {};
        for (const cat of BENCHMARK_DATA.kpis) {
          const catId = cat.id;
          let num = 0, den = 0;
          for (const sub of cat.subIndicators) {
            const customW = indicatorWeights && indicatorWeights[catId] && indicatorWeights[catId][sub.id];
            const w = customW !== undefined && customW !== null ? customW : sub.weight;
            const sv = scores[mid][catId].sub[sub.id];
            if (sv.normalized !== null && sv.normalized !== undefined) {
              num += sv.normalized * w;
              den += w;
            }
          }
          const catScore = den > 0 ? round(num / den, 1) : null;
          scores[mid][catId].score = catScore;
          scores[mid].kpis[catId] = catScore;
        }
        let onum = 0, oden = 0;
        for (const cat of BENCHMARK_DATA.kpis) {
          const s = scores[mid].kpis[cat.id];
          const customCW = categoryWeights && categoryWeights[cat.id];
          const w = customCW !== undefined && customCW !== null ? customCW : cat.weight;
          if (s !== null && s !== undefined) {
            onum += s * w;
            oden += w;
          }
        }
        scores[mid].overall = oden > 0 ? round(onum / oden, 1) : null;
      }
      return scores;
    };

    const WeightsPage = ({ indicatorWeights, setIndicatorWeights, categoryWeights, setCategoryWeights, resetWeights }) => {
      const isDe = currentLang === "de";
      const updateIndWeight = (catId, indId, val) => {
        const v = Math.max(0, Math.min(100, parseFloat(val) || 0));
        setIndicatorWeights(prev => ({ ...prev, [catId]: { ...(prev[catId] || {}), [indId]: v / 100 } }));
      };
      const updateCatWeight = (catId, val) => {
        const v = Math.max(0, Math.min(100, parseFloat(val) || 0));
        setCategoryWeights(prev => ({ ...prev, [catId]: v / 100 }));
      };
      return (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-ink">{isDe ? "Gewichtung" : "Weights"}</h1>
            <button onClick={resetWeights} className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90">{isDe ? "Zurücksetzen" : "Reset"}</button>
          </div>
          <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
            <h2 className="font-semibold mb-2">{isDe ? "Kategorie-Gewichtung" : "Category weights"}</h2>
            <p className="text-sm text-gray-600 mb-4">{isDe ? "Beeinflusst den Gesamtscore." : "Influences the overall score."}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BENCHMARK_DATA.kpis.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-paper">
                  <span className="font-medium">{cat.name[currentLang]}</span>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="100" value={round(((categoryWeights && categoryWeights[cat.id] !== undefined ? categoryWeights[cat.id] : cat.weight))*100,0)} onChange={e=>updateCatWeight(cat.id, e.target.value)} className="w-32" />
                    <span className="w-12 text-right font-mono text-sm">{fmt((categoryWeights && categoryWeights[cat.id] !== undefined ? categoryWeights[cat.id] : cat.weight)*100,0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {BENCHMARK_DATA.kpis.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl p-6 card-shadow border border-gray-100 mb-6">
              <h2 className="font-semibold mb-4">{cat.name[currentLang]} · {isDe ? "Indikator-Gewichtung" : "Indicator weights"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.subIndicators.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-paper">
                    <span className="text-sm">{sub.name[currentLang] || sub.name}</span>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" value={round(((indicatorWeights && indicatorWeights[cat.id] && indicatorWeights[cat.id][sub.id] !== undefined ? indicatorWeights[cat.id][sub.id] : sub.weight))*100,0)} onChange={e=>updateIndWeight(cat.id, sub.id, e.target.value)} className="w-32" />
                      <span className="w-12 text-right font-mono text-sm">{fmt((indicatorWeights && indicatorWeights[cat.id] && indicatorWeights[cat.id][sub.id] !== undefined ? indicatorWeights[cat.id][sub.id] : sub.weight)*100,0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    };

    const App = () => {
      return (
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      );
    };

    const AppInner = () => {
      const [modal, setModal] = useState(null);
      const [categoryModal, setCategoryModal] = useState(null);
      const [stakeholder, setStakeholder] = useState("stadt");
      const [indicatorWeights, setIndicatorWeights] = useState({});
      const [categoryWeights, setCategoryWeights] = useState({});
      const resetWeights = () => { setIndicatorWeights({}); setCategoryWeights({}); };
      const scores = useMemo(() => computeScores(indicatorWeights, categoryWeights), [indicatorWeights, categoryWeights]);
      return (
        <Router>
          <Layout stakeholder={stakeholder} setStakeholder={setStakeholder}>
            <Routes>
              <Route path="/" element={<Dashboard scores={scores} setModal={setModal} setCategoryModal={setCategoryModal} stakeholder={stakeholder} setStakeholder={setStakeholder} />} />
              <Route path="/municipalities" element={<MunicipalitiesPage scores={scores} />} />
              <Route path="/municipality/:id" element={<MunicipalityDetail scores={scores} setModal={setModal} stakeholder={stakeholder} setStakeholder={setStakeholder} />} />
              <Route path="/compare" element={<Compare scores={scores} setModal={setModal} stakeholder={stakeholder} setStakeholder={setStakeholder} />} />
              <Route path="/ranking" element={<Ranking scores={scores} categoryWeights={categoryWeights} />} />
              <Route path="/weights" element={<WeightsPage indicatorWeights={indicatorWeights} setIndicatorWeights={setIndicatorWeights} categoryWeights={categoryWeights} setCategoryWeights={setCategoryWeights} resetWeights={resetWeights} />} />
              <Route path="/maps" element={<MapsPage />} />
              <Route path="/calculator" element={<KpiCalculator />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/catalogue" element={<KpiCatalogue />} />
              <Route path="/api" element={<ApiPage />} />
              <Route path="/ai" element={<AiPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            {modal && <KpiDetailModal kpi={modal.kpi} municipality={modal.municipality} onClose={()=>setModal(null)} scores={scores} />}
            {categoryModal && <CategoryDetailModal kpi={categoryModal.kpi} onClose={()=>setCategoryModal(null)} scores={scores} />}
          </Layout>
        </Router>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>
'''

def build_dashboard():
    DATA = json.load(open(DATA_PATH, "r", encoding="utf-8"))
    DATA_JS = json.dumps(DATA, ensure_ascii=False, indent=2)
    HTML = HTML_TEMPLATE.replace("__DATA__", DATA_JS)
    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUT_STATIC_HTML.parent.mkdir(parents=True, exist_ok=True)
    open(OUT_HTML, "w", encoding="utf-8").write(HTML)
    open(OUT_STATIC_HTML, "w", encoding="utf-8").write(HTML)
    print("Generated new index.html")

if __name__ == "__main__":
    build_dashboard()
