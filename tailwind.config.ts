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
        ink: "#0b1020",
        navy: "#070b17",
        panel: "#ffffff",
        muted: "#667085",
        brand: "#6d28d9",
        sky: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        glow: "0 18px 45px rgba(109, 40, 217, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
