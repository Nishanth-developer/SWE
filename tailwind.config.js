/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  mode: "jit",
  theme: {
    extend: {
      margin: {
        'cent': '47rem',
      },
      fontFamily: {
        Nunito : ["Nunito", "sans-serif"],
      }
    },
  },
  plugins: [],
};
