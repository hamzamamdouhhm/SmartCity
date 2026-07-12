import React from "react";

const variants = {
  default: "bg-subtle text-text-secondary border border-border",
  success: "bg-success-50 text-success-600 border border-success-100 dark:border-success-500/30",
  warning: "bg-warning-50 text-warning-600 border border-warning-100 dark:border-warning-500/30",
  danger: "bg-danger-50 text-danger-600 border border-danger-100 dark:border-danger-500/30",
  info: "bg-info-50 text-info-600 border border-info-100 dark:border-info-500/30",
  brand: "bg-brand-50 text-brand-700 border border-brand-100 dark:border-brand-500/30",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

const radius = {
  pill: "rounded-full",
  md: "rounded-md",
};

export const Badge = React.forwardRef(function Badge(
  { children, variant = "default", size = "md", radius: r = "md", className = "", ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={`
        inline-flex items-center gap-1 font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${radius[r]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
});
