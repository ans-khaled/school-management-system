/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },

      keyframes: {
        rotate: {
          to: { transform: "rotate(1turn)" },
        },
      },
      animation: {
        rotate: "rotate 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
