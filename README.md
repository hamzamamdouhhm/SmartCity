# Smart City Benchmarking Dashboard

Premium Smart-City Benchmarking Dashboard für die Kommunen **Südharz**, **Landsberg**, **Leuna** und **Teutschenthal**.

## Inhalt

- Nur 4 Kommunen und 4 KPIs: Festnetz, Mobilfunk, Digitale Services, Daseinsvorsorge
- Echte CSV-Daten aus `Tabelle Abfrage1.csv` für Festnetz, Daseinsvorsorge und Kommunalprofil
- Transparente Berechnungsmethoden mit Formeln, Quellen, Rohdaten und normalisierten Scores
- Interaktive Karten, Vergleichstabellen, Ranking
- Stakeholder-Sichten: Stadtleitung, Bürger, Investor, Umzugsinteressent
- Exportfunktionen: PDF, Excel, CSV
- Sprachumschaltung DE / EN
- KI-Demonstrationsmodus (keine externe API-Verbindung)
- Vollständiges Authentifizierungssystem mit Registrierung, Login, Session-Management, Profil und Passwort-Änderung

## Projektstruktur

```
SmartCity/
├── index.html                  # Standalone React-Dashboard (Haupt-Deliverable)
├── backend/
│   ├── app.py                  # Flask-Backend mit Auth-API
│   ├── data/
│   │   ├── benchmarkData.json  # Datenmodell
│   │   └── users.db            # SQLite-Benutzerdatenbank
│   └── static/index.html       # Vom Backend ausgeliefertes Dashboard
├── frontend/                   # Vite-React-Scaffold (zukünftige Weiterentwicklung)
├── generate_data.py            # CSV-Import und Datenmodell-Generierung
├── build_dashboard.py          # Baut index.html aus Daten und Komponenten
└── README.md
```

## Schnellstart

### 1. Backend starten

```bash
cd backend
python app.py
```

Das Backend läuft auf `http://localhost:3001`.

### 2. Dashboard öffnen

Öffnen Sie `http://localhost:3001/` im Browser.

Das Dashboard ist eine eigenständige React-Anwendung, die direkt vom Backend ausgeliefert wird.

## API

### Benchmark
- `GET /api/benchmark` – Gesamtdaten (Konfiguration, Kommunen, KPIs, Werte)

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

- Die Daten stammen aus `resources/Tabelle Abfrage1.csv` (INKAR/BBSR) und werden über das Backend geladen.
- Festnetz und Daseinsvorsorge enthalten jetzt echte CSV-Rohwerte für alle vier Kommunen.
- Mobilfunk und Digitale Services verwenden ihre separaten Quellen; fehlende Werte werden als „Keine Daten verfügbar" angezeigt.
- Stakeholder-Sichten: Stadtleitung, Bürger, Investor, Umzugsinteressent.
- Exportfunktionen: PDF, Excel, CSV.
- CSV-Import-Assistent und Live-KI-Integration sind im Prototyp als UI-Platzhalter umgesetzt.
