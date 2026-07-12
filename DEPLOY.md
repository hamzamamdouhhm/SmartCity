# Deployment Guide (Render)

This project is easiest to deploy on **Render** as a single web service: the Flask backend builds the Vite frontend and serves the resulting `frontend/dist` files itself.

## One-click Blueprint

A `render.yaml` Blueprint is included in the repo root. In Render:

1. Create a **New +** → **Blueprint**.
2. Connect your GitHub repo.
3. Render will create one web service called `smartcity-dashboard`.

## Manual setup

If you prefer to create the service manually:

| Setting | Value |
|---|---|
| Environment | Python 3 |
| Build command | `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt` |
| Start command | `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2` |
| Python version | `3.12` |
| Node version | `20` |

Add an environment variable:

- `SECRET_KEY` – any long random string (used for Flask sessions).

Optional:

- `FRONTEND_URL` – only needed if you ever host the frontend on a different domain than the backend. With the default single-service setup this is not required.

## What happens on deploy?

1. Render installs Node dependencies and builds the Vite frontend into `frontend/dist`.
2. Render installs Python dependencies from `backend/requirements.txt`.
3. On startup, `backend/app.py` regenerates `backend/data/benchmarkData.json` from the CSV sources and creates the SQLite user database if it does not exist.
4. Gunicorn serves the Flask app, which hosts both the API (`/api/*`) and the static SPA (`/` and all client-side routes).

## Notes

- The free Render plan uses an ephemeral filesystem. SQLite data (`backend/data/users.db`) persists while the service is running but is reset on every deploy. For production user data, switch to PostgreSQL.
- The frontend is served by Flask, so CORS is not required in the default single-service setup.
- If you want to host the frontend separately on Render Static Sites, set `VITE_API_BASE` to your backend URL and update `FRONTEND_URL` in the backend environment.
