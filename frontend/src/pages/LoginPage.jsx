import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthFormCard from "../components/ui/AuthFormCard";

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  const { login, user } = useAuth();
  const navigate = useNavigate();
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
    <AuthFormCard title={t("login")} footer={<Link to="/register" className="text-forest hover:underline">{isDe ? "Noch kein Konto? Registrieren" : "No account? Register"}</Link>}>
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

export default LoginPage;
