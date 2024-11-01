/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FFD3CC",
          500: "#FF9A88",
          700: "#FD8572",
        },
        secondary: {
          500: "#3143C1",
        },
        tertiary: {
          500: "#EEF9FF",
        },
        backgroundColour: "#cbd5e1",
        placeholder: "#6b7280",
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
