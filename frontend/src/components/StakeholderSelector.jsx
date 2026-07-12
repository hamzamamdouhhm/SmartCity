import React from "react";
import { useTranslation } from "react-i18next";
import { useData } from "../hooks/useData";

const StakeholderSelector = ({ stakeholder, setStakeholder }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const { data } = useData();
  if (!data) return null;
  const isDe = currentLang === "de";
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow border border-gray-100 mb-6">
      <div className="text-sm text-muted mb-2">{isDe ? "Stakeholder-Sicht" : "Stakeholder view"}</div>
      <div className="flex flex-wrap gap-2">
        {Object.values(data.stakeholders).map(s => (
          <button key={s.id} onClick={() => setStakeholder(s.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${stakeholder === s.id ? "bg-forest text-white border-forest" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
            {s.name[currentLang]}
          </button>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-600">{data.stakeholders[stakeholder].description[currentLang]}</div>
    </div>
  );
};

export default StakeholderSelector;
