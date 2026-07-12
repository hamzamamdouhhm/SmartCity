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


export { CALCULATOR_SECTIONS, CALCULATORS };
