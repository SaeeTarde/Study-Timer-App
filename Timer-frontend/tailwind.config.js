/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Define a custom font family named 'pixel' using 'Tiny5'
      },
    },
  },
  plugins: [],
};
