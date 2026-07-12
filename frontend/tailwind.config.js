export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "!./src/_legacy_split/**/*"],
  theme: {
    extend: {
      colors: {
        // Semantic foundation
        base: "hsl(var(--color-base) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        "surface-elevated": "hsl(var(--color-surface-elevated) / <alpha-value>)",
        subtle: "hsl(var(--color-subtle) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        "border-strong": "hsl(var(--color-border-strong) / <alpha-value>)",

        // Semantic text
        "text-primary": "hsl(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "hsl(var(--color-text-secondary) / <alpha-value>)",
        "text-tertiary": "hsl(var(--color-text-tertiary) / <alpha-value>)",
        "text-inverse": "hsl(var(--color-text-inverse) / <alpha-value>)",
        "text-link": "hsl(var(--color-text-link) / <alpha-value>)",

        // Brand accent
        brand: {
          50: "hsl(var(--color-brand-50) / <alpha-value>)",
          100: "hsl(var(--color-brand-100) / <alpha-value>)",
          200: "hsl(var(--color-brand-200) / <alpha-value>)",
          300: "hsl(var(--color-brand-300) / <alpha-value>)",
          400: "hsl(var(--color-brand-400) / <alpha-value>)",
          500: "hsl(var(--color-brand-500) / <alpha-value>)",
          600: "hsl(var(--color-brand-600) / <alpha-value>)",
          700: "hsl(var(--color-brand-700) / <alpha-value>)",
          800: "hsl(var(--color-brand-800) / <alpha-value>)",
          900: "hsl(var(--color-brand-900) / <alpha-value>)",
        },

        // Semantic status
        success: {
          50: "hsl(var(--color-success-50) / <alpha-value>)",
          100: "hsl(var(--color-success-100) / <alpha-value>)",
          500: "hsl(var(--color-success-500) / <alpha-value>)",
          600: "hsl(var(--color-success-600) / <alpha-value>)",
        },
        warning: {
          50: "hsl(var(--color-warning-50) / <alpha-value>)",
          100: "hsl(var(--color-warning-100) / <alpha-value>)",
          500: "hsl(var(--color-warning-500) / <alpha-value>)",
          600: "hsl(var(--color-warning-600) / <alpha-value>)",
        },
        danger: {
          50: "hsl(var(--color-danger-50) / <alpha-value>)",
          100: "hsl(var(--color-danger-100) / <alpha-value>)",
          500: "hsl(var(--color-danger-500) / <alpha-value>)",
          600: "hsl(var(--color-danger-600) / <alpha-value>)",
        },
        info: {
          50: "hsl(var(--color-info-50) / <alpha-value>)",
          100: "hsl(var(--color-info-100) / <alpha-value>)",
          500: "hsl(var(--color-info-500) / <alpha-value>)",
          600: "hsl(var(--color-info-600) / <alpha-value>)",
        },

        // Categorical data colors (charts, municipalities)
        cat: {
          1: "hsl(var(--color-cat-1) / <alpha-value>)",
          2: "hsl(var(--color-cat-2) / <alpha-value>)",
          3: "hsl(var(--color-cat-3) / <alpha-value>)",
          4: "hsl(var(--color-cat-4) / <alpha-value>)",
          5: "hsl(var(--color-cat-5) / <alpha-value>)",
        },

        // Legacy aliases (to be removed after full migration)
        paper: "hsl(var(--color-base) / <alpha-value>)",
        card: "hsl(var(--color-surface) / <alpha-value>)",
        ink: "hsl(var(--color-text-primary) / <alpha-value>)",
        navy: "hsl(var(--color-info-500) / <alpha-value>)",
        emerald: "hsl(var(--color-success-500) / <alpha-value>)",
        forest: "hsl(var(--color-brand-600) / <alpha-value>)",
        gold: "hsl(var(--color-warning-500) / <alpha-value>)",
        good: "hsl(var(--color-success-500) / <alpha-value>)",
        mid: "hsl(var(--color-warning-500) / <alpha-value>)",
        low: "hsl(var(--color-danger-500) / <alpha-value>)",
        muted: "hsl(var(--color-text-tertiary) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        h1: ["2.5rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        h2: ["2rem", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" }],
        h3: ["1.5rem", { lineHeight: "1.25", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["0.75rem", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.025em" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px hsl(var(--color-shadow) / 0.05)",
        md: "0 4px 12px hsl(var(--color-shadow) / 0.06)",
        lg: "0 12px 24px hsl(var(--color-shadow) / 0.08)",
        xl: "0 24px 48px hsl(var(--color-shadow) / 0.12)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        fast: "100ms",
        base: "200ms",
        slow: "300ms",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out forwards",
        "fade-in-up": "fadeInUp 250ms ease-out forwards",
        "scale-in": "scaleIn 250ms ease-out forwards",
        "slide-down": "slideDown 200ms ease-out forwards",
      },
    },
  },
  plugins: [],
};
