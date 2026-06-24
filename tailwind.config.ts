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
        ink: "#2F4156",
        navy: "#2F4156",
        panel: "#F5EFEB",
        muted: "#7a9aad",
        brand: "#567C8D",
        sky: "#C8D9E6",
        success: "#10b981",
        warning: "#f59e0b"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(47, 65, 86, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
