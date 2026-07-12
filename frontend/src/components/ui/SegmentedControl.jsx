import React from "react";

export const SegmentedControl = ({ options = [], value, onChange, size = "md", className = "" }) => {
  const sizes = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-sm",
  };

  const itemSizes = {
    sm: "px-2.5 py-1",
    md: "px-3 py-1.5",
  };

  return (
    <div
      role="radiogroup"
      className={`
        inline-flex items-center gap-0.5
        bg-subtle border border-border rounded-md
        ${sizes[size]}
        ${className}
      `}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`
              ${itemSizes[size]} rounded-sm font-medium
              transition-all duration-fast
              focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-base
              ${isActive
                ? "bg-surface text-text-primary shadow-sm border border-border"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface/50"
              }
            `}
          >
            {option.icon && <span className="inline-flex items-center gap-1.5">{option.icon}{option.label}</span>}
            {!option.icon && option.label}
          </button>
        );
      })}
    </div>
  );
};
