import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumb = ({ items = [], className = "" }) => (
  <nav aria-label="Breadcrumb" className={className}>
    <ol className="flex items-center gap-1.5 text-sm">
      <li>
        <Link
          to="/"
          className="flex items-center gap-1 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
      </li>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.to || item.label} className="flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
            {isLast || !item.to ? (
              <span className={isLast ? "font-medium text-text-primary" : "text-text-tertiary"}>
                {item.label}
              </span>
            ) : (
              <Link to={item.to} className="text-text-tertiary hover:text-text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
