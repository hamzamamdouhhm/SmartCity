import React from "react";

export const Switch = React.forwardRef(function Switch(
  { label, checked, onChange, className = "", id, ...props },
  ref
) {
  const generatedId = React.useId();
  const switchId = id || generatedId;
  return (
    <label htmlFor={switchId} className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <span className="relative inline-flex items-center">
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <span
          className={`
            w-9 h-5 rounded-full
            bg-text-tertiary/30
            peer-checked:bg-brand-600
            transition-colors duration-fast
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-200 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-base
          `}
        />
        <span
          className={`
            absolute left-0.5 top-0.5
            w-4 h-4 rounded-full bg-surface
            transition-transform duration-fast
            peer-checked:translate-x-4
          `}
        />
      </span>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
});
