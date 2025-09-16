import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bizora: {
          navy: "#0C2440",
          orange: "#FF6A21",
          ink: "#0F172A",
          sand: "#F6F5F2",
          slate: "#64748B",
          border: "rgba(12,36,64,0.12)",
          surface: "rgba(12,36,64,0.04)"
        }
      },
      boxShadow: {
        soft: "0 8px 24px rgba(12,36,64,0.08)",
      },
      fontFamily: {
        sans: ["InterVariable", "Inter", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(12,36,64,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,36,64,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      }
    },
  },
  plugins: [],
};
export default config;
