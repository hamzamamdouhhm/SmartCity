import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  const { user, loading, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (newPwd.length < 6) { setError(isDe ? "Passwort muss mindestens 6 Zeichen haben." : "Password must be at least 6 characters."); return; }
    if (newPwd !== confirmPwd) { setError(isDe ? "Passwörter stimmen nicht überein." : "Passwords do not match."); return; }
    const res = await changePassword(currentPwd, newPwd);
    if (res.success) {
      setMessage(isDe ? "Passwort geändert." : "Password changed.");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } else {
      setError(res.error || (isDe ? "Fehler." : "Error."));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-6">{t("profile")}</h1>
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
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input type="password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} placeholder={isDe ? "Aktuelles Passwort" : "Current password"} className="w-full border rounded-lg px-3 py-2" required />
          <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder={isDe ? "Neues Passwort" : "New password"} className="w-full border rounded-lg px-3 py-2" required />
          <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder={isDe ? "Neues Passwort bestätigen" : "Confirm new password"} className="w-full border rounded-lg px-3 py-2" required />
          <button type="submit" className="px-4 py-2 bg-navy text-white rounded-lg font-medium hover:bg-navy/90">{isDe ? "Passwort ändern" : "Change password"}</button>
        </form>
      </div>
      <button onClick={() => { logout(); navigate("/"); }} className="w-full py-2 border-2 border-low text-low rounded-lg font-medium hover:bg-red-50">{t("logout")}</button>
    </div>
  );
};

export default ProfilePage;
