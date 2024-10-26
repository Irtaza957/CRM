/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#116FAC",
        darkprimary: "#044570",
        secondary: "#38B1A2",
        danger: "#e62626",
        grey: "#F5F6FA",
        grey50: "#D9D9D9",
        grey100: "#858688"
      },
      animation: {
        fadeDots: "fadeDots .8s infinite",
      },
      keyframes: {
        fadeDots: {
          "0%": { opacity: "0.2", transform: "scale(0.1)" },
          "60%": { opacity: "1", transform: "scale(1.2)" },
          "100%": { opacity: "0.2", transform: "scale(0.1)" },
        },
      },
    },
  },
  plugins: [],
};
