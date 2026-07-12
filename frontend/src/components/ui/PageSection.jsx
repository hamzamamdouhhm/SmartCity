import React from "react";

export const PageSection = ({ children, title, description, actions, icon: Icon, className = "" }) => (
  <section className={`mb-10 ${className}`}>
    {(title || description || actions) && (
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          {Icon && <Icon className="w-5 h-5 text-brand-600" />}
          <div>
            {title && <h2 className="text-h3 font-display text-text-primary tracking-tight">{title}</h2>}
            {description && <p className="mt-1.5 text-body-sm text-text-secondary">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    )}
    {children}
  </section>
);
