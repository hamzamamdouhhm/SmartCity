import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

export const Modal = ({ isOpen, onClose, title, description, children, size = "md", footer }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previouslyFocused = useRef(null);

  const widths = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      // Focus the title or close button after animation
      setTimeout(() => {
        const closeBtn = contentRef.current?.querySelector('[data-modal-close]');
        closeBtn?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        className={`
          relative w-full ${widths[size]}
          max-h-[90vh] overflow-y-auto
          bg-surface rounded-lg shadow-lg
          animate-scale-in
        `}
      >
        <div className="flex items-start justify-between gap-4 p-5 pb-0">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 id="modal-title" className="text-h3 font-display text-text-primary pr-8">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="mt-1 text-body text-text-secondary">
                {description}
              </p>
            )}
          </div>
          <IconButton
            data-modal-close
            label="Close"
            onClick={onClose}
            className="shrink-0 -mr-1 -mt-1"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-border bg-subtle/50 rounded-b-lg">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
