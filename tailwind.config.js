/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  theme: {
    extend: {
      spacing: {
        gutter: '1.5rem',
      },
      gap: {
        gutter: '1.5rem',
      },
    },
  },
  plugins: [],
  corePlugins: {
    container: false,
  },
};
