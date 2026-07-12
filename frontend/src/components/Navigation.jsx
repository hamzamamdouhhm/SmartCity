import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

const Navigation = ({ stakeholder, setStakeholder }) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data } = useData();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";
  if (!data) return null;
  const stakeholderOptions = Object.values(data.stakeholders).map(s => ({ id: s.id, label: s.name[lang] }));
  const mainLinks = [
    { to: "/", label: t("dashboard") },
    { to: "/municipalities", label: t("municipalities") },
    { to: "/compare", label: t("comparison") },
    { to: "/ranking", label: t("ranking") },
    { to: "/maps", label: t("maps") },
    { to: "/calculator", label: t("calculator") },
    { to: "/methodology", label: t("methodology") },
    { to: "/catalogue", label: lang === "de" ? "KPI-Katalog" : "KPI Catalogue" },
    { to: "/ai", label: t("ai") },
  ];
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="glass fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center text-white font-bold text-sm">SCB</div>
            <span className="font-display font-bold text-ink hidden sm:block">Smart City Benchmarking</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {mainLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-forest/10 text-forest" : "text-gray-600 hover:bg-gray-50"}`}>{l.label}</NavLink>
            ))}
            <select value={stakeholder} onChange={e=>setStakeholder(e.target.value)} className="ml-2 text-sm border rounded-lg px-2 py-1.5 bg-white text-gray-700">
              {stakeholderOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <div className="ml-2 flex border rounded-lg overflow-hidden text-sm font-medium">
              <button onClick={()=>i18n.changeLanguage("de")} className={`px-2 py-1 ${lang==="de"?"bg-forest text-white":"bg-white text-gray-600"}`}>DE</button>
              <button onClick={()=>i18n.changeLanguage("en")} className={`px-2 py-1 ${lang==="en"?"bg-forest text-white":"bg-white text-gray-600"}`}>EN</button>
            </div>
            {user ? (
              <div className="ml-2 flex items-center gap-2">
                <Link to="/profile" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{user.name}</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium text-low hover:bg-red-50">{t("logout")}</button>
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-1">
                <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-medium text-forest hover:bg-forest/10">{t("login")}</Link>
                <Link to="/register" className="px-3 py-2 rounded-lg text-sm font-medium bg-forest text-white hover:bg-forest/90">{lang === "de" ? "Registrieren" : "Register"}</Link>
              </div>
            )}
          </div>
          <button className="md:hidden text-ink" onClick={()=>setOpen(!open)}>☰</button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {mainLinks.map(l => <NavLink key={l.to} to={l.to} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{l.label}</NavLink>)}
            <select value={stakeholder} onChange={e=>setStakeholder(e.target.value)} className="block text-sm border rounded-lg px-3 py-2 bg-white text-gray-700 w-full mt-2">
              {stakeholderOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <div className="flex border rounded-lg overflow-hidden w-max mt-2">
              <button onClick={()=>i18n.changeLanguage("de")} className={`px-3 py-1 ${lang==="de"?"bg-forest text-white":"bg-white"}`}>DE</button>
              <button onClick={()=>i18n.changeLanguage("en")} className={`px-3 py-1 ${lang==="en"?"bg-forest text-white":"bg-white"}`}>EN</button>
            </div>
            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{user.name}</Link>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-low hover:bg-red-50">{t("logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{t("login")}</Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{lang === "de" ? "Registrieren" : "Register"}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
