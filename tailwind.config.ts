import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#FFA500", // Orange - matches github.io
          foreground: "#000000",
          glow: "rgba(255, 165, 0, 0.5)",
        },
        secondary: {
          DEFAULT: "#1a1a1a",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#2a2a2a",
          foreground: "#FFFFFF",
        },
        ring: "#FFA500",
        border: "#2a2a2a",
        input: "#2a2a2a",
        card: {
          DEFAULT: "#0a0a0a",
          foreground: "#FFFFFF",
        },
      },
      boxShadow: {
        "cyber-glow": "0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.3)",
        "cyber-glow-lg": "0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.5)",
        "cyber-border": "0 0 10px rgba(255, 165, 0, 0.5), inset 0 0 10px rgba(255, 165, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "fade-in-up": "fadeInUp 1s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "bounce-slow": "bounceSlow 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "from": { opacity: "0", transform: "translateY(-20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "from": { opacity: "0", transform: "translateY(30px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 10px rgba(255, 165, 0, 0.5), 0 0 20px rgba(255, 165, 0, 0.3)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.5)" },
        },
        bounceSlow: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
