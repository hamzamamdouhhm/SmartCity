import React from "react";

export const PageHeader = ({ title, description, actions, icon: Icon, className = "" }) => (
  <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 ${className}`}>
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-subtle border border-border items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-brand-600" />
        </div>
      )}
      <div>
        <h1 className="text-h1 font-display text-text-primary tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-body text-text-secondary max-w-2xl">{description}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
