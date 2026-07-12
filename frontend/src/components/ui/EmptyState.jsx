import React from "react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = "",
}) => (
  <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
    {Icon && (
      <div className="w-12 h-12 rounded-lg bg-subtle border border-border flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-text-tertiary" />
      </div>
    )}
    <h3 className="text-h4 font-display text-text-primary mb-1">{title}</h3>
    {description && <p className="text-body text-text-secondary max-w-sm mb-5">{description}</p>}
    {action || (actionLabel && onAction && (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    ))}
  </div>
);
