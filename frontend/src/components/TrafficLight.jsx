import React from "react";
import { fmt } from "../utils/formatting";
import { statusInfo } from "../utils/formatting";

const dotClasses = {
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  neutral: "bg-text-tertiary",
};

const TrafficLight = ({ score, thresholds, showLabel = true, size = "md" }) => {
  const info = statusInfo(score, thresholds);
  const hasData = score !== null && score !== undefined;
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-2" title={info.label}>
      <span className={`${dotSize} rounded-full ${dotClasses[info.variant]} ring-2 ring-surface`} />
      <div className="leading-tight">
        <div className={`${textSize} font-semibold tabular-nums text-text-primary`}>
          {hasData ? `${fmt(score, 0)}%` : "-"}
        </div>
        {showLabel && (
          <div className="text-xs text-text-tertiary">{info.label}</div>
        )}
      </div>
    </div>
  );
};

export default TrafficLight;
