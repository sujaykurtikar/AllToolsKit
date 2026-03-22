import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "var(--shadow-md)",
        "card-hover": "var(--shadow-card-hover)",
        glow: "0 0 0 1px rgba(37, 99, 235, 0.08), 0 8px 32px -8px rgba(37, 99, 235, 0.15)"
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
