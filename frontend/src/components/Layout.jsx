import React from "react";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";

const Layout = ({ children, stakeholder, setStakeholder }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "de";
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation stakeholder={stakeholder} setStakeholder={setStakeholder} />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">{children}</main>
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
          <span>© 2026 Smart City Benchmarking · {lang === "de" ? "Hochschulprojekt" : "University project"}</span>
          <span>{lang === "de" ? "Daten: INKAR / BBSR" : "Data: INKAR / BBSR"}</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
