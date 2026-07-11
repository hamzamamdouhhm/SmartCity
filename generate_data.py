import csv
import json
import re
from pathlib import Path

BASE = Path(r"C:\Users\d4\Documents\SmartCity")
RESOURCES = BASE / "resources"
OUT_FRONTEND = BASE / "frontend" / "src" / "data" / "benchmarkData.json"
OUT_BACKEND = BASE / "backend" / "data" / "benchmarkData.json"

name_map = {
    "Südharz": "suedharz",
    "Landsberg, Stadt": "landsberg",
    "Leuna, Stadt": "leuna",
    "Teutschenthal": "teutschenthal",
}

municipality_meta = {
    "suedharz": {"name": {"de": "Südharz", "en": "Südharz"}, "fullName": {"de": "Südharz", "en": "Südharz"}, "kreis": "Mansfeld-Südharz", "lat": 51.55, "lng": 11.10, "color": "#13322E", "description": {"de": "Gemeindeverband im Landkreis Mansfeld-Südharz.", "en": "Municipal association in Mansfeld-Südharz district."}},
    "landsberg": {"name": {"de": "Landsberg", "en": "Landsberg"}, "fullName": {"de": "Landsberg, Stadt", "en": "Landsberg, City"}, "kreis": "Saalekreis", "lat": 51.53, "lng": 12.16, "color": "#B97A2E", "description": {"de": "Stadt im Saalekreis.", "en": "City in Saalekreis district."}},
    "leuna": {"name": {"de": "Leuna", "en": "Leuna"}, "fullName": {"de": "Leuna, Stadt", "en": "Leuna, City"}, "kreis": "Saalekreis", "lat": 51.35, "lng": 12.02, "color": "#2E7A57", "description": {"de": "Stadt im Saalekreis.", "en": "City in Saalekreis district."}},
    "teutschenthal": {"name": {"de": "Teutschenthal", "en": "Teutschenthal"}, "fullName": {"de": "Teutschenthal", "en": "Teutschenthal"}, "kreis": "Saalekreis", "lat": 51.45, "lng": 11.81, "color": "#7A4E6D", "description": {"de": "Gemeinde im Saalekreis, Referenzkommune.", "en": "Municipality in Saalekreis district, reference municipality."}},
}


def parse_num(s):
    if s is None:
        return None
    s = str(s).strip()
    if s == "" or s == "0,00":
        return None
    # Handle percent signs
    is_percent = "%" in s
    s = s.replace("%", "").replace("Mbit/s", "").replace("m²", "").replace(" ", "")
    # Replace narrow no-break space and other unicode minuses
    s = s.replace("\u2212", "-").replace("\u2013", "-").replace("\u2014", "-")
    # German number format: 1.234,56 -> 1234.56
    # Strategy: if comma exists, it's the decimal separator; remove dots as thousands separators
    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    try:
        v = float(s)
        if is_percent:
            # store as percentage points (e.g. 6.87% stored as 6.87)
            pass
        return v
    except ValueError:
        return None


def parse_csv_rows(path, delimiter=";"):
    rows = []
    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f, delimiter=delimiter)
        for row in reader:
            rows.append([c.strip() for c in row])
    return rows


# ---------- Load Tabelle Abfrage1 ----------
def load_tabelle_abfrage1():
    rows = parse_csv_rows(RESOURCES / "Tabelle Abfrage1.csv", delimiter=";")
    header = rows[0]
    years = rows[1]
    data_rows = rows[2:]
    result = {}
    for row in data_rows:
        raum = row[1]
        mid = name_map.get(raum)
        if not mid:
            continue
        result[mid] = {}
        for idx in range(3, len(header)):
            col_name = header[idx]
            year = years[idx] if idx < len(years) else ""
            val = parse_num(row[idx])
            result[mid][col_name] = {"raw": val, "year": year, "source": "Tabelle Abfrage1.csv / INKAR / BBSR"}
    return result


# ---------- Load Festnetz ----------
def load_festnetz():
    rows = parse_csv_rows(RESOURCES / "Digitaler_Wandel_Benchmarking(Festnetz).csv", delimiter=";")
    result = {}
    for mid in name_map.values():
        result[mid] = {}
    # Row 1: header-ish, row 2: ";Mittelwert Festnetzempfang (Download) in Mbit/s;"
    for row in rows[2:]:
        if len(row) < 2:
            continue
        raum = row[0]
        # Map names
        if raum == "Landsberg":
            mid = "landsberg"
        elif raum == "Leuna":
            mid = "leuna"
        elif raum == "Südharz":
            mid = "suedharz"
        elif raum == "Teutschenthal":
            mid = "teutschenthal"
        else:
            continue
        val = parse_num(row[1])
        result[mid]["Mittelwert Festnetzempfang (Download) in Mbit/s"] = {"raw": val, "year": "", "source": "Digitaler_Wandel_Benchmarking(Festnetz).csv"}
    return result


# ---------- Load Mobilfunk ----------
def load_mobilfunk():
    rows = parse_csv_rows(RESOURCES / "Digitaler_Wandel_Benchmarking(Mobilfunk).csv", delimiter=";")
    result = {mid: {} for mid in name_map.values()}
    header = rows[1] if len(rows) > 1 else ["", "O2", "Vodafone", "Telekom"]
    for row in rows[2:]:
        if len(row) < 4:
            continue
        raum = row[0]
        if raum == "Landsberg":
            mid = "landsberg"
        elif raum == "Leuna":
            mid = "leuna"
        elif raum == "Südharz":
            mid = "suedharz"
        elif raum == "Teutschenthal":
            mid = "teutschenthal"
        else:
            continue
        result[mid]["Mobilfunk O2"] = {"raw": parse_num(row[1]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Mobilfunk).csv"}
        result[mid]["Mobilfunk Vodafone"] = {"raw": parse_num(row[2]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Mobilfunk).csv"}
        result[mid]["Mobilfunk Telekom"] = {"raw": parse_num(row[3]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Mobilfunk).csv"}
    return result


# ---------- Load Digitale Services ----------
def load_digitale_services():
    rows = parse_csv_rows(RESOURCES / "Digitaler_Wandel_Benchmarking(Digitale Services).csv", delimiter=";")
    result = {mid: {} for mid in name_map.values()}
    for row in rows[2:]:
        if len(row) < 3:
            continue
        raum = row[0]
        if raum == "Landsberg":
            mid = "landsberg"
        elif raum == "Leuna":
            mid = "leuna"
        elif raum == "Südharz":
            mid = "suedharz"
        elif raum == "Teutschenthal":
            mid = "teutschenthal"
        else:
            continue
        result[mid]["OZG Reifegrad-Mittelwert"] = {"raw": parse_num(row[1]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Digitale Services).csv"}
        result[mid]["OZG Prozentanteil ab Stufe 2"] = {"raw": parse_num(row[2]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Digitale Services).csv"}
    return result


# ---------- Load Daseinsvorsorge ----------
def load_daseinsvorsorge():
    rows = parse_csv_rows(RESOURCES / "Digitaler_Wandel_Benchmarking(Existenz Daseinsvorsorge).csv", delimiter=";")
    result = {mid: {} for mid in name_map.values()}
    for row in rows[3:]:
        if len(row) < 4:
            continue
        raum = row[0]
        if raum == "Landsberg":
            mid = "landsberg"
        elif raum == "Leuna":
            mid = "leuna"
        elif raum == "Südharz":
            mid = "suedharz"
        elif raum == "Teutschenthal":
            mid = "teutschenthal"
        else:
            continue
        result[mid]["Schulabdeckung"] = {"raw": parse_num(row[1]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Existenz Daseinsvorsorge).csv"}
        result[mid]["Kitas-Abdeckung"] = {"raw": parse_num(row[2]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Existenz Daseinsvorsorge).csv"}
        result[mid]["Gewerbegebiet pro 1.000 EW"] = {"raw": parse_num(row[3]), "year": "", "source": "Digitaler_Wandel_Benchmarking(Existenz Daseinsvorsorge).csv"}
    return result


def merge_sources(*sources):
    merged = {mid: {} for mid in name_map.values()}
    for src in sources:
        for mid, vals in src.items():
            if mid in merged:
                merged[mid].update(vals)
    return merged


# ---------- Indicator catalogue ----------
# Each indicator maps to a category and optionally to a CSV column key
INDICATORS = [
    # Festnetz
    {"id": "breitband_100", "category": "festnetz", "name": {"de": "Bandbreitenverfügbarkeit mindestens 100 Mbit/s", "en": "Bandwidth availability at least 100 Mbit/s"}, "unit": "%", "weight": 0.35, "higherIsBetter": True, "csvKey": "Bandbreitenverfügbarkeit mindestens 100 Mbit/s", "description": {"de": "Anteil der Haushalte mit mindestens 100 Mbit/s Bandbreite.", "en": "Share of households with at least 100 Mbit/s bandwidth."}},
    {"id": "festnetz_download", "category": "festnetz", "name": {"de": "Durchschnittliche Festnetzgeschwindigkeit (Download)", "en": "Average fixed-network download speed"}, "unit": "Mbit/s", "weight": 0.65, "higherIsBetter": True, "csvKey": "Mittelwert Festnetzempfang (Download) in Mbit/s", "description": {"de": "Mittlere Downloadgeschwindigkeit im Festnetz.", "en": "Average fixed-network download speed."}},

    # Mobilfunk
    {"id": "mobil_o2", "category": "mobilfunk", "name": {"de": "Mobilfunkempfang O2", "en": "Mobile reception O2"}, "unit": "dBm", "weight": 0.333, "higherIsBetter": True, "csvKey": "Mobilfunk O2", "description": {"de": "Durchschnittlicher Mobilfunkempfang O2. Weniger negative Werte sind besser.", "en": "Average mobile reception O2. Less negative values are better."}},
    {"id": "mobil_vodafone", "category": "mobilfunk", "name": {"de": "Mobilfunkempfang Vodafone", "en": "Mobile reception Vodafone"}, "unit": "dBm", "weight": 0.333, "higherIsBetter": True, "csvKey": "Mobilfunk Vodafone", "description": {"de": "Durchschnittlicher Mobilfunkempfang Vodafone. Weniger negative Werte sind besser.", "en": "Average mobile reception Vodafone. Less negative values are better."}},
    {"id": "mobil_telekom", "category": "mobilfunk", "name": {"de": "Mobilfunkempfang Telekom", "en": "Mobile reception Telekom"}, "unit": "dBm", "weight": 0.334, "higherIsBetter": True, "csvKey": "Mobilfunk Telekom", "description": {"de": "Durchschnittlicher Mobilfunkempfang Telekom. Weniger negative Werte sind besser.", "en": "Average mobile reception Telekom. Less negative values are better."}},

    # Digitale Services
    {"id": "ozg_reifegrad", "category": "digitale_services", "name": {"de": "OZG Reifegrad-Mittelwert", "en": "OZG maturity level average"}, "unit": "Level 0-4", "weight": 0.5, "higherIsBetter": True, "csvKey": "OZG Reifegrad-Mittelwert", "description": {"de": "Durchschnittlicher OZG-Reifegrad aller Services (Stufen 0–4).", "en": "Average OZG maturity level of all services (levels 0-4)."}},
    {"id": "ozg_pct_level2", "category": "digitale_services", "name": {"de": "OZG Anteil ab Stufe 2", "en": "OZG share level 2+"}, "unit": "%", "weight": 0.5, "higherIsBetter": True, "csvKey": "OZG Prozentanteil ab Stufe 2", "description": {"de": "Anteil der Services mit Reifegrad 2 oder höher.", "en": "Share of services with maturity level 2 or higher."}},

    # Daseinsvorsorge
    {"id": "bevoelkerung", "category": "daseinsvorsorge", "name": {"de": "Bevölkerung gesamt", "en": "Total population"}, "unit": "EW", "weight": 0.03, "higherIsBetter": True, "csvKey": "Bevölkerung gesamt", "description": {"de": "Gesamtbevölkerung der Kommune.", "en": "Total population of the municipality."}},
    {"id": "arbeitslose", "category": "daseinsvorsorge", "name": {"de": "Arbeitslose", "en": "Unemployed"}, "unit": "Personen", "weight": 0.04, "higherIsBetter": False, "csvKey": "Arbeitslose", "description": {"de": "Anzahl der Arbeitslosen. Niedrigere Werte sind besser.", "en": "Number of unemployed people. Lower values are better."}},
    {"id": "neubauwohnungen", "category": "daseinsvorsorge", "name": {"de": "Neubauwohnungen in Ein- und Zweifamilienhäusern", "en": "New dwellings in single and two-family houses"}, "unit": "Anzahl", "weight": 0.03, "higherIsBetter": True, "csvKey": "Neubauwohnungen in Ein- und Zweifamilienhäusern", "description": {"de": "Anzahl neuer Wohnungen in Ein- und Zweifamilienhäusern.", "en": "Number of new dwellings in single and two-family houses."}},
    {"id": "beschaeftigtenquote", "category": "daseinsvorsorge", "name": {"de": "Beschäftigtenquote", "en": "Employment rate"}, "unit": "%", "weight": 0.07, "higherIsBetter": True, "csvKey": "Beschäftigtenquote", "description": {"de": "Anteil der erwerbstätigen Bevölkerung. Höhere Werte sind besser.", "en": "Share of employed population. Higher values are better."}},
    {"id": "anteil_minijobs", "category": "daseinsvorsorge", "name": {"de": "Anteil Minijobs (Nebenverdienst)", "en": "Share of mini-jobs (secondary income)"}, "unit": "%", "weight": 0.03, "higherIsBetter": False, "csvKey": "Anteil Minijobs (Nebenverdienst)", "description": {"de": "Anteil der Beschäftigten in geringfügiger Beschäftigung. Niedrigere Werte sind besser.", "en": "Share of employees in marginal employment. Lower values are better."}},
    {"id": "durchschnittsalter", "category": "daseinsvorsorge", "name": {"de": "Durchschnittsalter der Bevölkerung", "en": "Average age of population"}, "unit": "Jahre", "weight": 0.03, "higherIsBetter": False, "csvKey": "Durchschnittsalter der Bevölkerung", "description": {"de": "Durchschnittsalter der Bevölkerung. Niedrigere Werte deuten auf mehr Dynamik hin.", "en": "Average age of population. Lower values indicate more dynamism."}},
    {"id": "studierende", "category": "daseinsvorsorge", "name": {"de": "Studierende", "en": "Students"}, "unit": "Anzahl", "weight": 0.03, "higherIsBetter": True, "csvKey": "Studierende", "description": {"de": "Anzahl der Studierenden. Höhere Werte sind besser.", "en": "Number of students. Higher values are better."}},
    {"id": "kaufkraft", "category": "daseinsvorsorge", "name": {"de": "Kaufkraft", "en": "Purchasing power"}, "unit": "EUR/EW", "weight": 0.07, "higherIsBetter": True, "csvKey": "Kaufkraft", "description": {"de": "Kaufkraft pro Einwohner. Höhere Werte sind besser.", "en": "Purchasing power per inhabitant. Higher values are better."}},
    {"id": "hh_mittel", "category": "daseinsvorsorge", "name": {"de": "Haushalte mit mittlerem Einkommen", "en": "Middle-income households"}, "unit": "%", "weight": 0.03, "higherIsBetter": True, "csvKey": "Haushalte mit mittlerem Einkommen", "description": {"de": "Anteil der Haushalte mit mittlerem Einkommen. Höhere Werte sind besser.", "en": "Share of middle-income households. Higher values are better."}},
    {"id": "kinderarzte", "category": "daseinsvorsorge", "name": {"de": "Kinderärzte", "en": "Paediatricians"}, "unit": "Anzahl", "weight": 0.05, "higherIsBetter": True, "csvKey": "Kinderärzte", "description": {"de": "Anzahl der Kinderärzte. Höhere Werte sind besser.", "en": "Number of paediatricians. Higher values are better."}},
    {"id": "hausarzte", "category": "daseinsvorsorge", "name": {"de": "Hausärzte", "en": "General practitioners"}, "unit": "Anzahl", "weight": 0.05, "higherIsBetter": True, "csvKey": "Hausärzte", "description": {"de": "Anzahl der Hausärzte. Höhere Werte sind besser.", "en": "Number of general practitioners. Higher values are better."}},
    {"id": "ent_super", "category": "daseinsvorsorge", "name": {"de": "Entfernung zum Supermarkt / Discounter", "en": "Distance to supermarket / discounter"}, "unit": "m", "weight": 0.05, "higherIsBetter": False, "csvKey": "Entfernung zum Supermarkt/Discounter", "description": {"de": "Durchschnittliche Entfernung zum nächsten Supermarkt oder Discounter. Niedrigere Werte sind besser.", "en": "Average distance to nearest supermarket or discounter. Lower values are better."}},
    {"id": "ent_hausarzt", "category": "daseinsvorsorge", "name": {"de": "Entfernung zum Hausarzt", "en": "Distance to GP"}, "unit": "m", "weight": 0.05, "higherIsBetter": False, "csvKey": "Entfernung zum Hausarzt", "description": {"de": "Durchschnittliche Entfernung zum nächsten Hausarzt. Niedrigere Werte sind besser.", "en": "Average distance to nearest GP. Lower values are better."}},
    {"id": "ent_apo", "category": "daseinsvorsorge", "name": {"de": "Entfernung zur Apotheke", "en": "Distance to pharmacy"}, "unit": "m", "weight": 0.05, "higherIsBetter": False, "csvKey": "Entfernung zur Apotheke", "description": {"de": "Durchschnittliche Entfernung zur nächsten Apotheke. Niedrigere Werte sind besser.", "en": "Average distance to nearest pharmacy. Lower values are better."}},
    {"id": "ent_oev", "category": "daseinsvorsorge", "name": {"de": "Entfernung zur ÖV-Haltestelle", "en": "Distance to public transport stop"}, "unit": "m", "weight": 0.05, "higherIsBetter": False, "csvKey": "Entfernung zur ÖV Haltestelle", "description": {"de": "Durchschnittliche Entfernung zur nächsten ÖV-Haltestelle. Niedrigere Werte sind besser.", "en": "Average distance to nearest public transport stop. Lower values are better."}},
    {"id": "ent_grund", "category": "daseinsvorsorge", "name": {"de": "Entfernung zur Grundschule", "en": "Distance to primary school"}, "unit": "m", "weight": 0.05, "higherIsBetter": False, "csvKey": "Entfernung zur Grundschule", "description": {"de": "Durchschnittliche Entfernung zur nächsten Grundschule. Niedrigere Werte sind besser.", "en": "Average distance to nearest primary school. Lower values are better."}},
    {"id": "strassen_unfaelle", "category": "daseinsvorsorge", "name": {"de": "Straßenverkehrsunfälle", "en": "Road traffic accidents"}, "unit": "Anzahl", "weight": 0.04, "higherIsBetter": False, "csvKey": "Straßenverkehrsunfälle", "description": {"de": "Anzahl der Straßenverkehrsunfälle. Niedrigere Werte sind besser.", "en": "Number of road traffic accidents. Lower values are better."}},
    {"id": "erreichbarkeit_autobahn", "category": "daseinsvorsorge", "name": {"de": "Erreichbarkeit von Autobahnen", "en": "Accessibility of motorways"}, "unit": "min", "weight": 0.06, "higherIsBetter": False, "csvKey": "Erreichbarkeit von Autobahnen", "description": {"de": "Durchschnittliche Reisezeit zur nächsten Autobahnanschlussstelle. Niedrigere Werte sind besser.", "en": "Average travel time to nearest motorway junction. Lower values are better."}},
    {"id": "erreichbarkeit_flughafen", "category": "daseinsvorsorge", "name": {"de": "Erreichbarkeit von Flughäfen", "en": "Accessibility of airports"}, "unit": "min", "weight": 0.04, "higherIsBetter": False, "csvKey": "Erreichbarkeit von Flughäfen", "description": {"de": "Durchschnittliche Reisezeit zum nächsten Flughafen. Niedrigere Werte sind besser.", "en": "Average travel time to nearest airport. Lower values are better."}},
    {"id": "schulabdeckung", "category": "daseinsvorsorge", "name": {"de": "Schulabdeckung", "en": "School coverage"}, "unit": "%", "weight": 0.05, "higherIsBetter": True, "csvKey": "Schulabdeckung", "description": {"de": "Anteil der Fläche mit Schulversorgung. Höhere Werte sind besser.", "en": "Share of area with school coverage. Higher values are better."}},
    {"id": "kitas_abdeckung", "category": "daseinsvorsorge", "name": {"de": "Kitas-Abdeckung", "en": "Kindergarten coverage"}, "unit": "%", "weight": 0.05, "higherIsBetter": True, "csvKey": "Kitas-Abdeckung", "description": {"de": "Anteil der Fläche mit Kita-Versorgung. Höhere Werte sind besser.", "en": "Share of area with kindergarten coverage. Higher values are better."}},
    {"id": "gewerbegebiet", "category": "daseinsvorsorge", "name": {"de": "Gewerbegebiet pro 1.000 EW", "en": "Commercial area per 1,000 inhabitants"}, "unit": "m²", "weight": 0.04, "higherIsBetter": True, "csvKey": "Gewerbegebiet pro 1.000 EW", "description": {"de": "Gewerbegebiet pro 1.000 Einwohner. Höhere Werte sind besser.", "en": "Commercial area per 1,000 inhabitants. Higher values are better."}},
]


# Categories (Level 1)
CATEGORIES = [
    {
        "id": "festnetz",
        "name": {"de": "Festnetz", "en": "Fixed Network"},
        "description": {"de": "Verfügbarkeit und Geschwindigkeit der Festnetzverbindungen.", "en": "Availability and speed of fixed-network connections."},
        "unit": {"de": "Punkte", "en": "Points"},
        "higherIsBetter": True,
        "weight": 0.25,
        "thresholds": {"green": 70, "yellow": 40, "red": 0},
        "formula": "\\bar{v} = \\frac{\\sum (v_i \\cdot w_i)}{\\sum w_i}",
        "source": {"de": "INKAR / BBSR / Breitbandatlas", "en": "INKAR / BBSR / Broadband atlas"},
        "lastUpdate": "2023/2024",
    },
    {
        "id": "mobilfunk",
        "name": {"de": "Mobilfunk", "en": "Mobile Network"},
        "description": {"de": "Mobilfunkempfang der drei Hauptnetzbetreiber.", "en": "Mobile reception of the three main network operators."},
        "unit": {"de": "Punkte", "en": "Points"},
        "higherIsBetter": True,
        "weight": 0.25,
        "thresholds": {"green": 70, "yellow": 40, "red": 0},
        "formula": "\\bar{r} = \\frac{\\sum (r_j \\cdot w_j)}{\\sum w_j}",
        "source": {"de": "CellMapper / externe Datenerhebung", "en": "CellMapper / external survey"},
        "lastUpdate": "2024",
    },
    {
        "id": "digitale_services",
        "name": {"de": "Digitale Services", "en": "Digital Services"},
        "description": {"de": "Digitalisierungsgrad der öffentlichen Verwaltungsservices nach OZG-Reifegradmodell.", "en": "Digitalization level of public administration services according to OZG maturity model."},
        "unit": {"de": "Punkte", "en": "Points"},
        "higherIsBetter": True,
        "weight": 0.25,
        "thresholds": {"green": 70, "yellow": 40, "red": 0},
        "formula": "\\bar{R} = \\frac{\\sum (R_i \\cdot w_i)}{\\sum w_i}",
        "source": {"de": "Gemeinde-Online-Serviceübersichten", "en": "Municipal online service overviews"},
        "lastUpdate": "2024",
    },
    {
        "id": "daseinsvorsorge",
        "name": {"de": "Daseinsvorsorge", "en": "Public Services"},
        "description": {"de": "Erreichbarkeit öffentlicher Einrichtungen, Gesundheitsversorgung, Bildung, Mobilität und sozioökonomische Rahmenbedingungen.", "en": "Accessibility of public facilities, healthcare, education, mobility and socio-economic framework conditions."},
        "unit": {"de": "Punkte", "en": "Points"},
        "higherIsBetter": True,
        "weight": 0.25,
        "thresholds": {"green": 70, "yellow": 40, "red": 0},
        "formula": "S = \\frac{\\sum (s_k \\cdot w_k)}{\\sum w_k}",
        "source": {"de": "INKAR / BBSR", "en": "INKAR / BBSR"},
        "lastUpdate": "2023/2024",
    },
]


def normalize(value, values, higher_is_better=True):
    present = [v for v in values if v is not None]
    if value is None or len(present) == 0:
        return None
    mn, mx = min(present), max(present)
    if mx == mn:
        return None  # No variance -> cannot rank
    n = (value - mn) / (mx - mn)
    if not higher_is_better:
        n = 1 - n
    return round(n * 100, 1)


def build_data():
    tabelle = load_tabelle_abfrage1()
    festnetz = load_festnetz()
    mobilfunk = load_mobilfunk()
    digitale = load_digitale_services()
    dasein = load_daseinsvorsorge()
    raw = merge_sources(tabelle, festnetz, mobilfunk, digitale, dasein)

    # Municipality list
    municipalities = []
    for mid in ["suedharz", "landsberg", "leuna", "teutschenthal"]:
        meta = municipality_meta[mid]
        m = {"id": mid, **meta}
        # Population from CSV if available
        if "Bevölkerung gesamt" in raw.get(mid, {}):
            m["population"] = int(raw[mid]["Bevölkerung gesamt"]["raw"]) if raw[mid]["Bevölkerung gesamt"]["raw"] is not None else meta.get("population")
        municipalities.append(m)

    # Build category -> indicators mapping
    category_indicators = {cat["id"]: [] for cat in CATEGORIES}
    for ind in INDICATORS:
        category_indicators[ind["category"]].append(ind)

    # Build KPI structure (categories with subIndicators)
    kpis = []
    for cat in CATEGORIES:
        sub_indicators = []
        for ind in category_indicators[cat["id"]]:
            sub = {
                "id": ind["id"],
                "name": ind["name"],
                "unit": ind["unit"],
                "weight": ind["weight"],
                "higherIsBetter": ind["higherIsBetter"],
                "description": ind["description"],
                "csvKey": ind["csvKey"],
            }
            sub_indicators.append(sub)
        kpis.append({**cat, "subIndicators": sub_indicators})

    # Build values
    values = {m["id"]: {} for m in municipalities}
    for m in municipalities:
        mid = m["id"]
        values[mid]["kpis"] = {}
        values[mid]["indicators"] = {}
        for cat in CATEGORIES:
            cat_id = cat["id"]
            values[mid][cat_id] = {"sub": {}}
            cat_scores = []
            cat_weights = []
            for ind in category_indicators[cat_id]:
                key = ind["csvKey"]
                entry = raw[mid].get(key, {"raw": None, "year": "", "source": "Nicht verfügbar"})
                val = entry["raw"]
                all_vals = [raw.get(other_mid, {}).get(key, {}).get("raw") for other_mid in [m2["id"] for m2 in municipalities]]
                norm = normalize(val, all_vals, ind["higherIsBetter"])
                indicator_record = {
                    "raw": val,
                    "unit": ind["unit"],
                    "source": entry.get("source", ""),
                    "date": entry.get("year", ""),
                    "higherIsBetter": ind["higherIsBetter"],
                    "normalized": norm,
                    "weight": ind["weight"],
                }
                values[mid][cat_id]["sub"][ind["id"]] = indicator_record
                values[mid]["indicators"][ind["id"]] = {**indicator_record, "category": cat_id, "name": ind["name"], "description": ind["description"]}
                if norm is not None:
                    cat_scores.append(norm * ind["weight"])
                    cat_weights.append(ind["weight"])
            cat_score = round(sum(cat_scores) / sum(cat_weights), 1) if cat_weights else None
            values[mid][cat_id]["score"] = cat_score
            values[mid]["kpis"][cat_id] = cat_score

        # Overall score
        overall_scores = []
        overall_weights = []
        for cat in CATEGORIES:
            s = values[mid]["kpis"][cat["id"]]
            if s is not None:
                overall_scores.append(s * cat["weight"])
                overall_weights.append(cat["weight"])
        values[mid]["overall"] = round(sum(overall_scores) / sum(overall_weights), 1) if overall_weights else None

        # Completeness
        total = len(INDICATORS)
        present = sum(1 for ind in INDICATORS if values[mid]["indicators"][ind["id"]]["raw"] is not None)
        values[mid]["completeness"] = round(present / total * 100, 1) if total else 0
        values[mid]["completeFields"] = present
        values[mid]["totalFields"] = total

    # Stakeholders (focus on categories; priority indicators updated)
    stakeholders = {
        "stadt": {
            "id": "stadt",
            "name": {"de": "Stadtleitung", "en": "City Management"},
            "focus": ["festnetz", "daseinsvorsorge", "digitale_services", "mobilfunk"],
            "priorityIndicators": ["breitband_100", "festnetz_download", "erreichbarkeit_autobahn", "kaufkraft", "beschaeftigtenquote"],
            "description": {"de": "Gesamtperspektive auf Infrastruktur, Daseinsvorsorge und Wirtschaftskraft.", "en": "Overall perspective on infrastructure, public services and economic strength."},
        },
        "buerger": {
            "id": "buerger",
            "name": {"de": "Bürger", "en": "Citizens"},
            "focus": ["daseinsvorsorge", "festnetz"],
            "priorityIndicators": ["breitband_100", "hausarzte", "ent_apo", "ent_super", "ent_grund", "ent_oev", "kinderarzte"],
            "description": {"de": "Fokus auf Alltagsrelevanz: Breitband, Ärzte, Apotheke, Einkauf, Schule, ÖV.", "en": "Focus on everyday relevance: broadband, doctors, pharmacy, shopping, school, public transport."},
        },
        "investor": {
            "id": "investor",
            "name": {"de": "Investor", "en": "Investor"},
            "focus": ["daseinsvorsorge", "festnetz", "mobilfunk"],
            "priorityIndicators": ["kaufkraft", "beschaeftigtenquote", "breitband_100", "festnetz_download", "erreichbarkeit_autobahn", "erreichbarkeit_flughafen", "gewerbegebiet"],
            "description": {"de": "Wirtschaftsstandort: Kaufkraft, Erwerbstätige, Verkehrsanbindung, Breitband.", "en": "Business location: purchasing power, employment, transport links, broadband."},
        },
        "umzug": {
            "id": "umzug",
            "name": {"de": "Umzugsinteressent", "en": "Relocating Interest"},
            "focus": ["daseinsvorsorge", "festnetz"],
            "priorityIndicators": ["ent_grund", "ent_super", "hausarzte", "ent_apo", "ent_oev", "breitband_100", "durchschnittsalter", "kinderarzte", "kitas_abdeckung"],
            "description": {"de": "Lebensqualität: Schulen, Einkauf, Gesundheit, Mobilität, Breitband, Alter.", "en": "Quality of life: schools, shopping, health, mobility, broadband, age."},
        },
    }

    # Profile indicators: short demographic/economic summary shown on municipality detail page
    profile_indicator_ids = {
        "bevoelkerung", "arbeitslose", "neubauwohnungen", "beschaeftigtenquote",
        "anteil_minijobs", "durchschnittsalter", "studierende", "kaufkraft",
        "hh_mittel", "strassen_unfaelle"
    }
    profile_indicators = []
    for ind in INDICATORS:
        if ind["id"] in profile_indicator_ids:
            profile_indicators.append({
                "id": ind["id"],
                "name": ind["name"],
                "unit": ind["unit"],
                "csvColumn": ind["csvKey"],
                "higherIsBetter": ind["higherIsBetter"],
                "description": ind["description"],
            })

    # Methodology
    methodology = {
        cat["id"]: {
            "de": f"{cat['name']['de']}: {cat['description']['de']} Der Kategorie-Score ist der gewichtete Mittelwert der einzelnen Indikatoren.",
            "en": f"{cat['name']['en']}: {cat['description']['en']} The category score is the weighted average of individual indicators.",
        }
        for cat in CATEGORIES
    }
    methodology["normalization"] = {
        "de": "Höher-ist-besser: (Wert − Minimum) / (Maximum − Minimum) × 100. Niedriger-ist-besser: (Maximum − Wert) / (Maximum − Minimum) × 100. Bei fehlenden Werten oder fehlender Varianz: 'Keine Daten verfügbar'.",
        "en": "Higher-is-better: (Value − Minimum) / (Maximum − Minimum) × 100. Lower-is-better: (Maximum − Value) / (Maximum − Minimum) × 100. For missing values or no variance: 'No data available'.",
    }

    data = {
        "config": {
            "version": "3.0",
            "lastUpdated": "2026-07-12",
            "defaultLanguage": "de",
            "scoreThresholds": {"green": 70, "yellow": 40, "red": 0},
            "overallWeights": {cat["id"]: cat["weight"] for cat in CATEGORIES},
            "csvSource": "Tabelle Abfrage1.csv; Digitaler_Wandel_Benchmarking(Festnetz/Mobilfunk/Digitale Services/Existenz Daseinsvorsorge).csv",
        },
        "municipalities": municipalities,
        "kpis": kpis,
        "profileIndicators": profile_indicators,
        "stakeholders": stakeholders,
        "values": values,
        "methodology": methodology,
        "indicatorCatalogue": [
            {
                "id": ind["id"],
                "name": ind["name"],
                "category": ind["category"],
                "unit": ind["unit"],
                "weight": ind["weight"],
                "higherIsBetter": ind["higherIsBetter"],
                "csvKey": ind["csvKey"],
                "source": "s. Datenquelle im Wert",
                "description": ind["description"],
                "formula": "(Wert − Min) / (Max − Min) × 100" if ind["higherIsBetter"] else "(Max − Wert) / (Max − Min) × 100",
            }
            for ind in INDICATORS
        ],
    }
    return data


def main():
    data = build_data()
    OUT_FRONTEND.parent.mkdir(parents=True, exist_ok=True)
    OUT_BACKEND.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_FRONTEND, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    with open(OUT_BACKEND, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Generated benchmarkData.json with", len(data["municipalities"]), "municipalities and", len(data["indicatorCatalogue"]), "indicators")


if __name__ == "__main__":
    main()
