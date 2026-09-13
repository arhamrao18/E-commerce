/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1116",
          900: "#0A0C10",
          800: "#12151B",
          700: "#1A1E26",
          600: "#252A34",
        },
        porcelain: {
          DEFAULT: "#F2F4F3",
          50: "#FAFBFA",
          100: "#F2F4F3",
          200: "#E7EAE7",
        },
        emerald: {
          DEFAULT: "#0F6B5C",
          50: "#E8F3F0",
          100: "#C9E4DD",
          400: "#1D8E7A",
          500: "#0F6B5C",
          600: "#0B5147",
          900: "#062C26",
        },
        brass: {
          DEFAULT: "#C9A15A",
          100: "#F1E4C9",
          300: "#DDBD85",
          500: "#C9A15A",
          600: "#A8813F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(6, 20, 17, 0.12)",
        "glass-lg": "0 20px 60px rgba(6, 20, 17, 0.18)",
        "glow-emerald": "0 0 60px rgba(15, 107, 92, 0.35)",
        "glow-brass": "0 0 40px rgba(201, 161, 90, 0.3)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
}
