export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "!./src/_legacy_split/**/*"],
  theme: {
    extend: {
      colors: {
        paper: "#F8FAF7",
        card: "#FFFFFF",
        ink: "#0F2E2A",
        navy: "#1A3A4A",
        emerald: "#10B981",
        forest: "#064E3B",
        gold: "#D4A017",
        good: "#059669",
        mid: "#D97706",
        low: "#DC2626",
        muted: "#6B7280"
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
      }
    }
  }
}
