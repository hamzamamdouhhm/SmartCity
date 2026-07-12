import React from "react";

const variants = {
  default: "text-text-secondary hover:bg-subtle hover:text-text-primary",
  ghost: "text-text-tertiary hover:text-text-primary hover:bg-subtle",
  danger: "text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-50/10",
};

const sizes = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

export const IconButton = React.forwardRef(function IconButton(
  { children, variant = "default", size = "md", className = "", label, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        rounded-md
        transition-colors duration-fast
        focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-base
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});
