import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  GitCompare,
  Trophy,
  Map,
  Calculator,
  BookOpen,
  List,
  Database,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Globe,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { Button, IconButton, ThemeToggle, SegmentedControl, Select } from "./ui";
import { Logo } from "./Logo";

const Navigation = ({ stakeholder, setStakeholder }) => {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useData();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";

  useEffect(() => {
    const handleClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (!data) return null;

  const stakeholderOptions = Object.values(data.stakeholders).map((s) => ({
    value: s.id,
    label: s.name[lang],
  }));

  const primaryLinks = [
    { to: "/", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/municipalities", label: t("municipalities"), icon: Building2 },
    { to: "/compare", label: t("comparison"), icon: GitCompare },
    { to: "/ranking", label: t("ranking"), icon: Trophy },
    { to: "/maps", label: t("maps"), icon: Map },
  ];

  const secondaryLinks = [
    { to: "/calculator", label: t("calculator"), icon: Calculator },
    { to: "/methodology", label: t("methodology"), icon: BookOpen },
    { to: "/catalogue", label: t("kpiCatalogue"), icon: List },
    { to: "/data", label: t("data"), icon: Database },
    { to: "/ai", label: t("ai"), icon: Sparkles },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isSecondaryActive = secondaryLinks.some((l) => location.pathname === l.to);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 border-b border-border backdrop-blur-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <Logo size={34} className="transition-transform duration-fast group-hover:scale-105" />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-text-primary text-[15px] tracking-tight leading-none block">
                Smart City
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-tertiary leading-none">
                Benchmarking
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-fast ${
                    isActive
                      ? "text-brand-700 dark:text-brand-500"
                      : "text-text-secondary hover:text-text-primary hover:bg-subtle"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <l.icon className="w-4 h-4" />
                    <span>{l.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-600 dark:bg-brand-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-fast ${
                  moreOpen || isSecondaryActive
                    ? "text-brand-700 dark:text-brand-500 bg-brand-50 dark:bg-brand-50/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-subtle"
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                {t("more")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-fast ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {moreOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-surface border border-border rounded-lg shadow-lg p-1 animate-slide-down z-50">
                  {secondaryLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-fast ${
                          isActive
                            ? "text-brand-700 dark:text-brand-500 bg-brand-50 dark:bg-brand-50/10"
                            : "text-text-secondary hover:text-text-primary hover:bg-subtle"
                        }`
                      }
                    >
                      <l.icon className="w-4 h-4" />
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side controls */}
          <div className="hidden lg:flex items-center gap-1">
            <SegmentedControl
              options={stakeholderOptions}
              value={stakeholder}
              onChange={setStakeholder}
              size="sm"
            />

            <div className="h-5 w-px bg-border mx-2" />

            <div className="flex items-center bg-subtle rounded-md p-0.5">
              <button
                onClick={() => i18n.changeLanguage("de")}
                aria-pressed={lang === "de"}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-fast ${
                  lang === "de"
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                DE
              </button>
              <button
                onClick={() => i18n.changeLanguage("en")}
                aria-pressed={lang === "en"}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-fast ${
                  lang === "en"
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                EN
              </button>
            </div>

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-1 ml-1 pl-2 border-l border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<User className="w-4 h-4" />}
                  onClick={() => navigate("/profile")}
                >
                  {user.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                >
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-1 pl-2 border-l border-border">
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  {t("login")}
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  {t("register")}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <IconButton label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-4 space-y-1 border-t border-border animate-slide-down">
            {[...primaryLinks, ...secondaryLinks].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-fast ${
                    isActive
                      ? "text-brand-700 dark:text-brand-500 bg-brand-50 dark:bg-brand-50/10"
                      : "text-text-secondary hover:bg-subtle"
                  }`
                }
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-border mt-2 space-y-3">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3 mb-1.5 block">
                  {t("stakeholderView")}
                </span>
                <Select
                  value={stakeholder}
                  onChange={(e) => setStakeholder(e.target.value)}
                  className="px-3"
                >
                  {stakeholderOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="px-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-text-tertiary" />
                <div className="flex border border-border rounded-md overflow-hidden bg-subtle p-0.5">
                  <button
                    onClick={() => i18n.changeLanguage("de")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded ${
                      lang === "de"
                        ? "bg-surface text-text-primary shadow-sm"
                        : "text-text-tertiary"
                    }`}
                  >
                    DE
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage("en")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded ${
                      lang === "en"
                        ? "bg-surface text-text-primary shadow-sm"
                        : "text-text-tertiary"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {user ? (
                <div className="px-3 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    leftIcon={<User className="w-4 h-4" />}
                    onClick={() => navigate("/profile")}
                  >
                    {user.name}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    leftIcon={<LogOut className="w-4 h-4" />}
                    onClick={handleLogout}
                  >
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                <div className="px-3 space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate("/login")}
                  >
                    {t("login")}
                  </Button>
                  <Button className="w-full" onClick={() => navigate("/register")}>
                    {t("register")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
