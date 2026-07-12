# Deploy on PythonAnywhere (free, no credit card)

PythonAnywhere is a no-card-required host for Python web apps. With this setup, the Flask backend serves the built Vite frontend from `frontend/dist`, so everything runs as one app.

## 1. Create a PythonAnywhere account

Sign up at https://www.pythonanywhere.com (free tier is fine).

## 2. Upload / clone the project

Open a **Bash console** and run:

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git SmartCity
cd SmartCity
```

If you are not using Git, upload the project files through the **Files** tab instead.

## 3. Build the frontend

PythonAnywhere consoles usually have Node available. Try building inside the console:

```bash
cd ~/SmartCity/frontend
npm install
npm run build
```

This creates `frontend/dist`. If Node is not available on your free tier, build the frontend on your local machine and upload the `frontend/dist` folder through the PythonAnywhere **Files** tab.

## 4. Create a virtual environment and install Python dependencies

```bash
cd ~/SmartCity/backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 5. Create the web app

1. Go to the PythonAnywhere **Web** tab.
2. Click **Add a new web app**.
3. Choose **Manual configuration**.
4. Select **Python 3.12**.
5. After creation, under **Code**, set:
   - **Source code:** `/home/<your-username>/SmartCity/backend`
   - **Working directory:** `/home/<your-username>/SmartCity/backend`
   - **WSGI configuration file:** click the file path, replace its contents with:

```python
import sys
sys.path.insert(0, '/home/<your-username>/SmartCity')
sys.path.insert(0, '/home/<your-username>/SmartCity/backend')
from wsgi import application
```

> Replace `<your-username>` with your PythonAnywhere username.

6. Under **Virtualenv**, enter: `/home/<your-username>/SmartCity/backend/venv`

## 6. Set environment variables

In the PythonAnywhere **Web** tab, under **Environment variables**, add:

```
SECRET_KEY=any-long-random-string-here
```

Generate a strong random string locally if needed.

## 7. Reload the app

Click the **Reload** button for your web app. PythonAnywhere will run the WSGI file, which imports `backend/app.py`. On import, the app regenerates `backend/data/benchmarkData.json` and creates `backend/data/users.db` if they do not exist.

## 8. Visit the site

Your app will be available at:

```
https://<your-username>.pythonanywhere.com
```

## Updating after code changes

1. Pull the latest code (or upload new files).
2. If frontend code changed, rebuild `frontend/dist`.
3. Click **Reload** in the PythonAnywhere Web tab.

## Notes

- The free tier has limited bandwidth and CPU. It is fine for demos and small user bases.
- The SQLite user database (`backend/data/users.db`) is stored on disk and persists across reloads on PythonAnywhere, unlike Render’s ephemeral filesystem.
- If you want a custom domain, that requires a paid plan.
