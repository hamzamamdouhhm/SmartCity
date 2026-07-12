import React from "react";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-8xl",
  fluid: "max-w-none",
};

export const Container = ({ children, width = "default", className = "", as: Component = "div", ...props }) => (
  <Component
    className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${widths[width]} ${className}`}
    {...props}
  >
    {children}
  </Component>
);
