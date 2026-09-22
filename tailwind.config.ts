import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#121212",
        panel: "#1a1a1a",
        primary: "#00f0ff", // cyan accent
        secondary: "#3b82f6", // blue accent
        danger: "#ef4444",
        warning: "#f59e0b",
        success: "#10b981",
        border: "#27272a",
        textMain: "#ffffff",
        textMuted: "#a1a1aa",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
