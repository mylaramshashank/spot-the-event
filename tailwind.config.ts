import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chalk: "#EEF1F4",
        paper: "#FFFFFF",
        ink: {
          DEFAULT: "#12151C",
          soft: "#1C2230",
          mute: "#2A3142",
        },
        mist: {
          DEFAULT: "#5B6578",
          soft: "#7A8496",
        },
        line: "#D5DBE5",
        signal: {
          DEFAULT: "#1FA97A",
          dark: "#178A63",
          soft: "#E6F7F0",
          mist: "#D0EFE3",
        },
        alert: "#C23B2E",
        // legacy aliases used across existing components
        offwhite: "#EEF1F4",
        surface: "#E6EAF0",
        rule: "#D5DBE5",
        navy: {
          950: "#0A0C11",
          900: "#12151C",
          800: "#1C2230",
          700: "#2A3142",
          600: "#3A455A",
        },
        slate: {
          500: "#7A8496",
          600: "#5B6578",
          DEFAULT: "#5B6578",
        },
        emerald: {
          DEFAULT: "#1FA97A",
          600: "#178A63",
          100: "#E6F7F0",
          50: "#F2FBF7",
        },
        rust: "#C23B2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.12em",
      },
      boxShadow: {
        lift: "0 12px 40px -18px rgba(18, 21, 28, 0.28)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pan-slow": {
          "0%": { transform: "scale(1.08) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.12) translate3d(-1.5%, 1%, 0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.7s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
        "pan-slow": "pan-slow 18s ease-in-out alternate infinite",
      },
    },
  },
  plugins: [],
};
export default config;
