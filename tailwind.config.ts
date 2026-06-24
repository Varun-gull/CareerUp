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
        navy: "#111827",
        panel: "#ffffff",
        muted: "#64748b",
        brand: "#2563eb",
        sky: "#38bdf8",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
