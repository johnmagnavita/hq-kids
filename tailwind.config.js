/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFF9F0",
        otavio: "#3B82F6",
        nicolle: "#A855F7",
        angelina: "#F472B6",
        coin: "#FBBF24",
        xp: "#22C55E",
      },
      fontFamily: {
        display: ["Fredoka"],
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
};
