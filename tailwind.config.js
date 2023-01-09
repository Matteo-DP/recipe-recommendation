/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./pages/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#4833CE",
        textlight: "#1E1E1E",
        textlighter: "#575757",
        bglight: "#D9D9D9",
        bglighter: "#E3E3E3"
      }
    },
  },
  plugins: [],
}
