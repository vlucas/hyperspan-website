/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts}'],
  theme: {
    extend: {},
  },
  /** DaisyUI **/
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark'],
  },
};
