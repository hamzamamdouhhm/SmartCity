import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AiPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";
  const [tab, setTab] = useState("chatgpt");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const suggestions = isDe ? [
    "Welche Kommune hat den besten Festnetz-Score?",
    "Vergleiche Mobilfunk in Leuna und Teutschenthal.",
    "Warum ist der Daseinsvorsorge-Score in Südharz niedriger?",
    "Erkläre die Formel für Digitale Services."
  ] : [
    "Which municipality has the best fixed-network score?",
    "Compare mobile network in Leuna and Teutschenthal.",
    "Why is the public-services score lower in Südharz?",
    "Explain the Digital Services formula."
  ];
  const answer = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes("festnetz") && lower.includes("best")) return isDe ? "Südharz hat mit 93,66 % die höchste Abdeckung an Haushalten mit ≥100 Mbit/s (INKAR 2023)." : "Südharz has the highest household coverage of ≥100 Mbit/s at 93.66% (INKAR 2023).";
    if (lower.includes("leuna") && lower.includes("teutschenthal") && lower.includes("mobilfunk")) return isDe ? "Für Teutschenthal liegen keine Mobilfunk-Rohdaten vor. Leuna hat Werte für alle drei Netzbetreiber." : "No mobile raw data is available for Teutschenthal. Leuna has values for all three operators.";
    if (lower.includes("südharz") && lower.includes("daseinsvorsorge")) return isDe ? "Südharz hat die höchste Bandbreitenabdeckung, aber bei Entfernungen zu Ärzten und Supermärkten verbesserungswürdige Werte." : "Südharz has the highest broadband coverage, but distances to doctors and supermarkets show room for improvement.";
    if (lower.includes("digitale services") && lower.includes("formel")) return isDe ? "Der Score basiert auf dem OZG-Reifegradmodell (Stufen 0–4). Normalisierung: Durchschnittlicher Reifegrad / 4 × 100." : "The score is based on the OZG maturity model (levels 0–4). Normalization: average maturity level / 4 × 100.";
    if (lower.includes("best") || lower.includes("beste")) return isDe ? "Leuna erreicht den höchsten Gesamtscore, da für diese Kommune die meisten aktuellen Rohdaten vorliegen." : "Leuna achieves the highest overall score because the most recent raw data is available for this municipality.";
    if (lower.includes("fehl") || lower.includes("missing")) return isDe ? "Für Mobilfunk und Digitale Services liegen für Südharz und Teutschenthal keine Rohdaten vor." : "No raw data is available for mobile network and digital services for Südharz and Teutschenthal.";
    return isDe ? "Dies kann anhand der verfügbaren Daten nicht bestätigt werden." : "I cannot confirm this from the available data.";
  };
  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }, { role: "ai", text: answer(input) }]);
    setInput("");
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-ink">{t("ai")}</h1>
        <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium">{t("aiDemo")}</span>
      </div>
      <p className="text-gray-600 mb-6">{t("aiDemoNote")}</p>
      <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          {["chatgpt", "claude", "gemini"].map(tn => (
            <button key={tn} onClick={()=>setTab(tn)} className={`flex-1 py-3 text-sm font-medium capitalize ${tab===tn ? "bg-forest text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{tn}</button>
          ))}
        </div>
        <div className="p-4 h-80 overflow-y-auto space-y-3 bg-paper/30">
          {messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-10">{isDe ? "Stellen Sie eine Frage zu den Daten." : "Ask a question about the data."}</div>}
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded-xl max-w-[80%] ${msg.role === "user" ? "bg-forest text-white ml-auto" : "bg-white border border-gray-100"}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2 mb-3 flex-wrap">
            {suggestions.map((s,i) => <button key={i} onClick={()=>{ setInput(s); setMessages([...messages, {role:"user",text:s}, {role:"ai",text:answer(s)}]); }} className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">{s}</button>)}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter" && send()} className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder={isDe ? "Frage eingeben..." : "Type a question..."} />
            <button onClick={send} className="px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium">{isDe ? "Senden" : "Send"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPage;
