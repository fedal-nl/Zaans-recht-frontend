/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: { "zaans-blue": "#002B5C" },
      fontFamily: { sans: ["Open Sans", "sans-serif"] },
    },
  },
  plugins: [],
};
