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
        },
      },
      fontFamily: {
        sans: ["var(--font-plus)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px rgba(11, 18, 32, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
