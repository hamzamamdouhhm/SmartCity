import React from "react";

export const Slider = React.forwardRef(function Slider(
  { label, value, min = 0, max = 100, step = 1, onChange, className = "", id, ...props },
  ref
) {
  const generatedId = React.useId();
  const sliderId = id || (label ? generatedId : undefined);
  return (
    <div className={className}>
      {label && (
        <label htmlFor={sliderId} className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={`
          w-full h-2 rounded-full appearance-none cursor-pointer
          bg-subtle
          accent-brand-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-base
        `}
        {...props}
      />
    </div>
  );
});
