import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#4FB3FF",
          green: "#97D700",
          orange: "#FF6A00",
          ink: "#0B1220",
          mist: "#F5F7FA",
          soft: "#EAF6FF",
          deep: "#0A2540",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          600: "#475569",
          800: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(11, 18, 32, 0.12)",
        lift: "0 16px 50px rgba(11, 18, 32, 0.16)",
        glow: "0 0 0 1px rgba(79, 179, 255, 0.12), 0 12px 28px rgba(79, 179, 255, 0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 12s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
