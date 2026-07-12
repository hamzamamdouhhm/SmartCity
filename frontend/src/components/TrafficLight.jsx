import React from "react";
import { fmt } from "../utils/formatting";
import { statusInfo } from "../utils/formatting";

const TrafficLight = ({ score, thresholds, showLabel = true }) => {
  const info = statusInfo(score, thresholds);
  return (
    <div className="flex items-center gap-2" title={info.label}>
      <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 bg-white" style={{ borderColor: info.color }}>
        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: info.color }}></div>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold" style={{ color: info.color }}>{score !== null ? fmt(score, 0) + "%" : "-"}</div>
        {showLabel && <div className="text-xs text-gray-500">{info.label}</div>}
      </div>
    </div>
  );
};

export default TrafficLight;
