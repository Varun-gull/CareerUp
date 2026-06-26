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
        ink: "#090d18",
        navy: "#060914",
        panel: "#ffffff",
        muted: "#64748b",
        brand: "#7c3aed",
        electric: "#2563eb",
        sky: "#06b6d4",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(15, 23, 42, 0.10)",
        glow: "0 18px 45px rgba(124, 58, 237, 0.22)",
        strong: "0 24px 80px rgba(15, 23, 42, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
