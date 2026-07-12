import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Bot, User } from "lucide-react";
import { Badge, Button, Card, Input, PageHeader, SegmentedControl } from "../components/ui";

const AiPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const isDe = currentLang === "de";

  const [tab, setTab] = useState("chatgpt");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const suggestions = isDe
    ? [
        "Welche Kommune hat den besten Festnetz-Score?",
        "Vergleiche Mobilfunk in Leuna und Teutschenthal.",
        "Warum ist der Daseinsvorsorge-Score in Südharz niedriger?",
        "Erkläre die Formel für Digitale Services.",
      ]
    : [
        "Which municipality has the best fixed-network score?",
        "Compare mobile network in Leuna and Teutschenthal.",
        "Why is the public-services score lower in Südharz?",
        "Explain the Digital Services formula.",
      ];

  const answer = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes("festnetz") && lower.includes("best"))
      return isDe
        ? "Südharz hat mit 93,66 % die höchste Abdeckung an Haushalten mit ≥100 Mbit/s (INKAR 2023)."
        : "Südharz has the highest household coverage of ≥100 Mbit/s at 93.66% (INKAR 2023).";
    if (lower.includes("leuna") && lower.includes("teutschenthal") && lower.includes("mobilfunk"))
      return isDe
        ? "Für Teutschenthal liegen keine Mobilfunk-Rohdaten vor. Leuna hat Werte für alle drei Netzbetreiber."
        : "No mobile raw data is available for Teutschenthal. Leuna has values for all three operators.";
    if (lower.includes("südharz") && lower.includes("daseinsvorsorge"))
      return isDe
        ? "Südharz hat die höchste Bandbreitenabdeckung, aber bei Entfernungen zu Ärzten und Supermärkten verbesserungswürdige Werte."
        : "Südharz has the highest broadband coverage, but distances to doctors and supermarkets show room for improvement.";
    if (lower.includes("digitale services") && lower.includes("formel"))
      return isDe
        ? "Der Score basiert auf dem OZG-Reifegradmodell (Stufen 0–4). Normalisierung: Durchschnittlicher Reifegrad / 4 × 100."
        : "The score is based on the OZG maturity model (levels 0–4). Normalization: average maturity level / 4 × 100.";
    if (lower.includes("best") || lower.includes("beste"))
      return isDe
        ? "Leuna erreicht den höchsten Gesamtscore, da für diese Kommune die meisten aktuellen Rohdaten vorliegen."
        : "Leuna achieves the highest overall score because the most recent raw data is available for this municipality.";
    if (lower.includes("fehl") || lower.includes("missing"))
      return isDe
        ? "Für Mobilfunk und Digitale Services liegen für Südharz und Teutschenthal keine Rohdaten vor."
        : "No raw data is available for mobile network and digital services for Südharz and Teutschenthal.";
    return isDe
      ? "Dies kann anhand der verfügbaren Daten nicht bestätigt werden."
      : "I cannot confirm this from the available data.";
  };

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }, { role: "ai", text: answer(input) }]);
    setInput("");
  };

  const sendSuggestion = (s) => {
    setMessages([...messages, { role: "user", text: s }, { role: "ai", text: answer(s) }]);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <PageHeader
        title={t("ai")}
        description={t("aiDemoNote")}
        actions={<Badge variant="warning">{t("aiDemo")}</Badge>}
      />

      <Card padding="none" className="overflow-hidden flex flex-col h-[600px]">
        <div className="p-3 border-b border-border bg-subtle/50">
          <SegmentedControl
            options={[
              { value: "chatgpt", label: "ChatGPT" },
              { value: "claude", label: "Claude" },
              { value: "gemini", label: "Gemini" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-base">
          {messages.length === 0 && (
            <div className="text-center text-text-tertiary text-sm mt-10">
              {t("askQuestion")}
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-brand-600 text-text-inverse" : "bg-surface border border-border text-text-secondary"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-brand-600 text-text-inverse"
                    : "bg-surface border border-border text-text-primary"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-surface">
          <div className="flex gap-2 mb-3 flex-wrap">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendSuggestion(s)}
                className="text-xs px-2.5 py-1.5 rounded-md bg-subtle text-text-secondary hover:bg-subtle/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("typeQuestion")}
              className="flex-1"
            />
            <Button onClick={send} leftIcon={<Send className="w-4 h-4" />}>
              {t("send")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AiPage;
