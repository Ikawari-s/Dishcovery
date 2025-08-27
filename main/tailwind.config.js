/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Dancing Script"', 'cursive'],
        body: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
