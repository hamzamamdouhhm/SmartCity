import React from "react";

const variants = {
  default: "bg-surface border border-border shadow-sm",
  interactive: "bg-surface border border-border shadow-sm cursor-pointer transition-all duration-base hover:border-brand-200 dark:hover:border-brand-500/30",
  highlighted: "bg-surface border-2 border-brand-200 shadow-sm",
  flat: "bg-surface border border-border",
  subtle: "bg-subtle border border-border/60",
  elevated: "bg-surface border border-border shadow-md",
};

const paddings = {
  none: "",
  compact: "p-4",
  default: "p-5",
  relaxed: "p-6",
  auth: "p-8",
};

const radius = {
  default: "rounded-lg",
  sm: "rounded-md",
  lg: "rounded-xl",
  none: "rounded-none",
};

export const Card = React.forwardRef(function Card(
  { children, variant = "default", padding = "default", radius: r = "default", className = "", as: Component = "div", ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`
        ${radius[r]}
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
});
