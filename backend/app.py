from flask import Flask, jsonify, send_from_directory, make_response, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import json, os, sqlite3, uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "smartcity-dev-secret-key-change-in-production")
CORS(app, supports_credentials=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "benchmarkData.json")
STATIC_DIR = os.path.join(BASE_DIR, "static")
DB_PATH = os.path.join(BASE_DIR, "data", "users.db")

def load_data():
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'public',
            language TEXT DEFAULT 'de',
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ---------- Auth helpers ----------
def user_to_dict(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "role": row["role"],
        "language": row["language"],
        "createdAt": row["created_at"]
    }

# ---------- Public API ----------
@app.route("/api/benchmark")
def get_benchmark():
    response = make_response(jsonify(load_data()))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

# ---------- Auth API ----------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    language = data.get("language") or "de"

    errors = []
    if len(name) < 2:
        errors.append("Name must be at least 2 characters.")
    if "@" not in email or "." not in email:
        errors.append("Valid email is required.")
    if len(password) < 6:
        errors.append("Password must be at least 6 characters.")
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    conn = get_db()
    try:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify({"success": False, "errors": ["Email already registered."]}), 409
        user_id = str(uuid.uuid4())
        password_hash = generate_password_hash(password)
        created_at = datetime.utcnow().isoformat()
        conn.execute(
            "INSERT INTO users (id, name, email, password_hash, role, language, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, name, email, password_hash, "registered", language, created_at)
        )
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        session["user_id"] = user_id
        return jsonify({"success": True, "user": user_to_dict(user)}), 201
    finally:
        conn.close()

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"success": False, "errors": ["Email and password are required."]}), 400

    conn = get_db()
    try:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"success": False, "errors": ["Invalid email or password."]}), 401
        session["user_id"] = user["id"]
        return jsonify({"success": True, "user": user_to_dict(user)})
    finally:
        conn.close()

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"success": True})

@app.route("/api/auth/me")
def me():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "user": None}), 200
    conn = get_db()
    try:
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user:
            session.pop("user_id", None)
            return jsonify({"success": False, "user": None}), 200
        return jsonify({"success": True, "user": user_to_dict(user)})
    finally:
        conn.close()

@app.route("/api/auth/profile", methods=["PUT"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "errors": ["Not authenticated."]}), 401
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    language = data.get("language") or "de"
    if len(name) < 2:
        return jsonify({"success": False, "errors": ["Name must be at least 2 characters."]}), 400
    conn = get_db()
    try:
        conn.execute("UPDATE users SET name = ?, language = ? WHERE id = ?", (name, language, user_id))
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return jsonify({"success": True, "user": user_to_dict(user)})
    finally:
        conn.close()

@app.route("/api/auth/change-password", methods=["PUT"])
def change_password():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "errors": ["Not authenticated."]}), 401
    data = request.get_json() or {}
    current = data.get("currentPassword") or ""
    new_password = data.get("newPassword") or ""
    if len(new_password) < 6:
        return jsonify({"success": False, "errors": ["New password must be at least 6 characters."]}), 400
    conn = get_db()
    try:
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user or not check_password_hash(user["password_hash"], current):
            return jsonify({"success": False, "errors": ["Current password is incorrect."]}), 401
        conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (generate_password_hash(new_password), user_id))
        conn.commit()
        return jsonify({"success": True})
    finally:
        conn.close()

# ---------- Static files ----------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path and os.path.exists(os.path.join(STATIC_DIR, path)):
        response = make_response(send_from_directory(STATIC_DIR, path))
    else:
        response = make_response(send_from_directory(STATIC_DIR, "index.html"))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
