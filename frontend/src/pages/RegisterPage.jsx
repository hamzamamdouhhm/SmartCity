import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthFormCard from "../components/ui/AuthFormCard";

const RegisterPage = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  const { register, user } = useAuth();
  const navigate = useNavigate();
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

export default RegisterPage;
