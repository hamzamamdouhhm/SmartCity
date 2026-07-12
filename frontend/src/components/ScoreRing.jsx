import React from "react";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { statusInfo } from "../utils/formatting";

const ScoreRing = ({ score, size = 56, stroke = 6 }) => {
  const { data } = useData();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = score !== null ? score : 0;
  const dash = `${pct * c / 100} ${c}`;
  const thresholds = data?.config?.scoreThresholds || { green: 70, yellow: 40 };
  const color = score !== null ? statusInfo(score, thresholds).color : "#9AA69B";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="transparent" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="transparent" strokeDasharray={dash} strokeLinecap="round" />
      </svg>
      <div className="absolute text-sm font-bold" style={{ color }}>{score !== null ? fmt(score,0) : "-"}</div>
    </div>
  );
};

export default ScoreRing;
