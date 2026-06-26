import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        navy: "#070b12",
        panel: "#101722",
        muted: "#94a3b8",
        brand: "#93c5fd",
        electric: "#38bdf8",
        sky: "#7dd3fc",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(0, 0, 0, 0.26)",
        glow: "0 18px 45px rgba(56, 189, 248, 0.20)",
        strong: "0 24px 80px rgba(0, 0, 0, 0.34)"
      }
    }
  },
  plugins: []
};

export default config;
