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
        offwhite: "#F8FAFC", // Crisp modern off-white (no beige/yellow tint)
        paper: "#FFFFFF",    // Pure clean card surface
        surface: "#F1F5F9",  // Subtle light slate surface
        rule: "#E2E8F0",     // Clean, modern hairline border
        navy: {
          950: "#060B18",
          900: "#0B1530",    // Rich deep navy primary text & accents
          800: "#111E44",
          700: "#16264F",    // Deep navy secondary
          600: "#1E3A8A",
        },
        slate: {
          500: "#64748B",
          600: "#475569",
          DEFAULT: "#475569", // Crisp muted text
        },
        emerald: {
          DEFAULT: "#10B981", // Vibrant, crisp tech emerald (no murky olive/forest)
          600: "#059669",
          100: "#D1FAE5",
          50: "#ECFDF5",
        },
        rust: "#DC2626",      // Urgent closing soon indicator
      },
      fontFamily: {
        display: ["var(--font-heading)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        sans: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.14em",
      },
    },
  },
  plugins: [],
};
export default config;
