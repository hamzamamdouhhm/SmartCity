import React from "react";
import { useData } from "../hooks/useData";
import { fmt } from "../utils/formatting";
import { statusInfo } from "../utils/formatting";

const variantClasses = {
  success: "text-success-500",
  warning: "text-warning-500",
  danger: "text-danger-500",
  neutral: "text-text-tertiary",
};

const ScoreRing = ({ score, size = 56, stroke = 6, animate = true }) => {
  const { data } = useData();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = score !== null && score !== undefined ? score : 0;
  const dash = `${pct * c / 100} ${c}`;
  const thresholds = data?.config?.scoreThresholds || { green: 70, yellow: 40 };
  const info = statusInfo(score, thresholds);
  const colorClass = variantClasses[info.variant] || variantClasses.neutral;
  const hasData = score !== null && score !== undefined;

  return (
    <div className={`relative flex items-center justify-center ${colorClass}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="text-border"
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={dash}
          strokeLinecap="round"
          className={animate ? "transition-all duration-slow ease-out" : ""}
        />
      </svg>
      <div className="absolute text-sm font-bold tabular-nums">
        {hasData ? fmt(score, 0) : "-"}
      </div>
    </div>
  );
};

export default ScoreRing;
