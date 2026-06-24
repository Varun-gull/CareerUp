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
        ink: "#1a1625",
        navy: "#221b35",
        panel: "#f5f3f9",
        muted: "#9b8dba",
        brand: "#6b3fa0",
        sky: "#c4a8d8",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(26, 22, 37, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
