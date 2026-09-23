/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbfa",
          100: "#d4f4f1",
          400: "#2dd4c8",
          500: "#0ea5a0",
          600: "#0b8580",
          700: "#0a6b67",
        },
      },
    },
  },
  plugins: [],
};
