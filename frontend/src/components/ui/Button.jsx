import React from "react";
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-brand-600 text-text-inverse hover:bg-brand-700 active:bg-brand-800",
  secondary: "bg-surface text-text-primary border border-border-strong hover:bg-subtle active:bg-subtle",
  ghost: "bg-transparent text-text-secondary hover:bg-subtle hover:text-text-primary active:bg-subtle",
  danger: "bg-danger-500 text-text-inverse hover:bg-danger-600 active:bg-danger-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

export const Button = React.forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    leftIcon,
    rightIcon,
    loading = false,
    disabled = false,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-md font-medium
        transition-all duration-fast ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-base
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner size={size === "sm" ? 14 : 16} className="text-current" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
