# Smart City Benchmarking Dashboard

Premium Smart-City Benchmarking Dashboard für die Kommunen **Südharz**, **Landsberg**, **Leuna** und **Teutschenthal**.

## Inhalt

- Nur 4 Kommunen: Südharz, Landsberg, Leuna, Teutschenthal
- Alle statistischen Indikatoren aus `Tabelle Abfrage1.csv` sowie ergänzenden CSV-Dateien zu Festnetz, Mobilfunk, Digitale Services und Daseinsvorsorge als einzelne KPIs
- Vier KPI-Hauptkategorien: Festnetz, Mobilfunk, Digitale Services, Daseinsvorsorge
- Zwei Ebenen: Level 1 Kategorie-Scores, Level 2 Einzelindikatoren mit Details-Button
- Transparente Min-Max-Normalisierung auf Basis der vier Kommunen, keine Erfindung von Werten
- Sichtbare und konfigurierbare Gewichtung auf Kategorie- und Indikatorebene
- Stakeholder-Sichten: Stadtleitung, Bürger, Investor, Umzugsinteressent
- Exportfunktionen: PDF, Excel, CSV
- KPI-Katalog mit allen Indikatoren, Einheiten, Jahren, Quellen, Formeln und Bewertungsrichtungen
- Sprachumschaltung DE / EN
- KI-Demonstrationsmodus (keine externe API-Verbindung)
- Vollständiges Authentifizierungssystem mit Registrierung, Login, Session-Management, Profil und Passwort-Änderung

## Projektstruktur

```
SmartCity/
├── index.html                  # Standalone React-Dashboard (Haupt-Deliverable)
├── backend/
│   ├── app.py                  # Flask-Backend mit Auth-API
│   ├── generate_data.py        # CSV-Import, Normalisierung und Datenmodell-Generierung
│   ├── data/
│   │   ├── csv/                # Quell-CSV-Dateien
│   │   │   ├── Tabelle Abfrage1.csv
│   │   │   ├── Digitaler_Wandel_Benchmarking(Festnetz).csv
│   │   │   ├── Digitaler_Wandel_Benchmarking(Mobilfunk).csv
│   │   │   ├── Digitaler_Wandel_Benchmarking(Digitale Services).csv
│   │   │   └── Digitaler_Wandel_Benchmarking(Existenz Daseinsvorsorge).csv
│   │   ├── benchmarkData.json  # Autoritäre Datenquelle (29 Indikatoren, 4 Kategorien)
│   │   └── users.db            # SQLite-Benutzerdatenbank
│   └── static/index.html       # Vom Backend ausgeliefertes Dashboard
├── frontend/                   # Vite-React-Scaffold (zukünftige Weiterentwicklung)
├── frontend/src/data/benchmarkData.json # Frontend-Kopie des Datenmodells
├── resources/                  # Weitere Projektressourcen (PDFs, Bilder, Präsentationen)
├── build_dashboard.py          # Baut index.html aus Daten und React-Komponenten
└── README.md
```

## Schnellstart

### 1. Backend starten

```bash
cd backend
python app.py
```

Beim Start werden automatisch aus den CSV-Quellen neu generiert:

- `backend/data/benchmarkData.json`
- `frontend/src/data/benchmarkData.json`
- `index.html`
- `backend/static/index.html`

Das Backend läuft auf `http://localhost:3001`.

### 2. Dashboard öffnen

Öffnen Sie `http://localhost:3001/` im Browser.

Das Dashboard ist eine eigenständige React-Anwendung, die direkt vom Backend ausgeliefert wird.

## API

### Benchmark
- `GET /api/benchmark` – Gesamtdaten (Konfiguration, Kommunen, KPI-Kategorien, Einzelindikatoren, Werte, Katalog)

### Authentifizierung
- `POST /api/auth/register` – Registrierung mit Name, Email, Passwort
- `POST /api/auth/login` – Login mit Email, Passwort
- `POST /api/auth/logout` – Session beenden
- `GET /api/auth/me` – Aktuellen Benutzer abfragen
- `PUT /api/auth/profile` – Profil (Name, Sprache) aktualisieren
- `PUT /api/auth/change-password` – Passwort ändern

Sessions werden per Flask-Session-Cookie verwaltet; Passwörter werden mit Werkzeug gehasht in einer SQLite-Datenbank (`backend/data/users.db`) gespeichert.

## Datenbankschema

Tabelle `users`:

| Feld | Typ | Beschreibung |
|---|---|---|
| id | TEXT PRIMARY KEY | UUID des Benutzers |
| name | TEXT NOT NULL | Anzeigename |
| email | TEXT NOT NULL UNIQUE | E-Mail-Adresse |
| password_hash | TEXT NOT NULL | Gehashtes Passwort |
| role | TEXT DEFAULT 'public' | Benutzerrolle |
| language | TEXT DEFAULT 'de' | Bevorzugte Sprache |
| created_at | TEXT NOT NULL | Erstellungszeitpunkt (ISO) |

## Hinweise

- Alle statistischen Variablen aus `backend/data/csv/Tabelle Abfrage1.csv` werden als separate KPIs dargestellt und den vier Hauptkategorien zugeordnet.
- Zusätzliche Quellen: `backend/data/csv/Digitaler_Wandel_Benchmarking(Festnetz).csv`, `(Mobilfunk).csv`, `(Digitale Services).csv`, `(Existenz Daseinsvorsorge).csv`.
- Normalisierung erfolgt ausschließlich über die vier Zielkommunen:
  - Höher-ist-besser: `(Wert − Min) / (Max − Min) × 100`
  - Niedriger-ist-besser: `(Max − Wert) / (Max − Min) × 100`
- Bei fehlenden Werten oder fehlender Varianz (alle Werte gleich) wird „Keine Daten verfügbar" angezeigt; es werden keine Werte erfunden.
- Die Gewichtung ist im Dashboard unter `/weights` sichtbar und per Slider anpassbar.
- Der KPI-Katalog unter `/catalogue` listet alle Indikatoren mit Einheit, Jahr, Quelle, Formel und Bewertungsrichtung.
- Stakeholder-Sichten: Stadtleitung, Bürger, Investor, Umzugsinteressent.
- Exportfunktionen: PDF, Excel, CSV.
- CSV-Import-Assistent und Live-KI-Integration sind im Prototyp als UI-Platzhalter umgesetzt.
