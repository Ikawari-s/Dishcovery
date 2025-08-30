/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Dancing Script"', 'cursive'],
        body: ['Quicksand', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
