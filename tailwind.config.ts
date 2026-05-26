import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        "bg-2": "#0c0c0c",
        surface: "#121212",
        "surface-2": "#1a1a1a",
        line: "#232323",
        "line-soft": "#1b1b1b",
        text: "#f5f3ef",
        "text-2": "#a8a4a0",
        "text-3": "#6b6864",
        accent: "#E11D2A",
        "accent-2": "#ff3a47",
        "accent-deep": "#8e0d16",
      },
      fontFamily: {
        anton: ["Anton", "sans-serif"],
        manrope: ["Manrope", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
