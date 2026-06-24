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
        ink: "#494D5F",
        navy: "#494D5F",
        panel: "#ffffff",
        muted: "#8458B3",
        brand: "#8458B3",
        "brand-dark": "#6d429a",
        sky: "#A0D2EB",
        lavender: "#E5EAF5",
        accent: "#D0BDF4",
        charcoal: "#494D5F",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(73, 77, 95, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
