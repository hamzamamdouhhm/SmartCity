import React from "react";

export const Select = React.forwardRef(function Select(
  { label, error, hint, children, className = "", id, ...props },
  ref
) {
  const generatedId = React.useId();
  const selectId = id || (label ? generatedId : undefined);
  const errorId = error ? `${selectId}-error` : undefined;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text-secondary mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={`
          w-full h-10
          bg-surface text-text-primary text-sm
          border rounded-md
          px-3 py-2
          transition-colors duration-fast
          hover:border-border-strong
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-base
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-danger-500 focus-visible:ring-danger-200" : "border-border"}
        `}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-text-tertiary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
});
