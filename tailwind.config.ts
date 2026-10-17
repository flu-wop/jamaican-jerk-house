import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16130F",
        cream: "#F4ECDA",
        gold: "#E3A93D",
        green: "#1E5C43",
        ember: "#A63A2C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
