export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EAEDE6",
        card: "#F6F7F2",
        ink: "#13322E",
        accent: "#B97A2E",
        good: "#2E7A57",
        mid: "#C7962F",
        low: "#B24A34"
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"]
      }
    }
  }
}
