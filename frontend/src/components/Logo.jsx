import React from "react";

export const Logo = ({ className = "", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Background */}
    <rect x="2" y="2" width="28" height="28" rx="7" className="fill-brand-600 dark:fill-brand-500" />
    {/* Building bars */}
    <rect x="8" y="17" width="4" height="7" rx="1" className="fill-text-inverse" />
    <rect x="14" y="12" width="4" height="12" rx="1" className="fill-text-inverse" />
    <rect x="20" y="8" width="4" height="16" rx="1" className="fill-text-inverse" />
    {/* Smart indicator dot */}
    <circle cx="24" cy="7" r="3" className="fill-warning-400" />
  </svg>
);

export const LogoMark = ({ className = "", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="28" height="28" rx="7" className="fill-brand-600 dark:fill-brand-500" />
    <rect x="8" y="17" width="4" height="7" rx="1" className="fill-text-inverse" />
    <rect x="14" y="12" width="4" height="12" rx="1" className="fill-text-inverse" />
    <rect x="20" y="8" width="4" height="16" rx="1" className="fill-text-inverse" />
    <circle cx="24" cy="7" r="3" className="fill-warning-400" />
  </svg>
);
