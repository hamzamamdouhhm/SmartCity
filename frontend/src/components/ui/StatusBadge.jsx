import React from "react";
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from "lucide-react";

const config = {
  excellent: {
    icon: CheckCircle2,
    variant: "success",
  },
  good: {
    icon: CheckCircle2,
    variant: "success",
  },
  medium: {
    icon: AlertCircle,
    variant: "warning",
  },
  weak: {
    icon: XCircle,
    variant: "danger",
  },
  veryWeak: {
    icon: XCircle,
    variant: "danger",
  },
  noData: {
    icon: HelpCircle,
    variant: "default",
  },
};

export const StatusBadge = ({ status = "noData", label, size = "md", showIcon = true, className = "" }) => {
  const { icon: Icon, variant } = config[status] || config.noData;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium
        ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"}
        rounded-md
        border
        ${variant === "success" && "bg-success-50 text-success-600 border-success-100 dark:border-success-500/30"}
        ${variant === "warning" && "bg-warning-50 text-warning-600 border-warning-100 dark:border-warning-500/30"}
        ${variant === "danger" && "bg-danger-50 text-danger-600 border-danger-100 dark:border-danger-500/30"}
        ${variant === "default" && "bg-subtle text-text-tertiary border-border"}
        ${className}
      `}
    >
      {showIcon && <Icon size={size === "sm" ? 12 : 14} />}
      {label}
    </span>
  );
};
