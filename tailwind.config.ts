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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-bg": "#FAEBD7",
        "brand-ink": "#1A1A1A",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
