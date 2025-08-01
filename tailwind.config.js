export default {
  content: [
    "./continents/**/*.vue",
    "./settlements/**/*.{vue,js,ts}",
    "./main.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        fira: ['"Fira Code"', "monospace"],
        pacifico: ['"Pacifico"', "cursive"],
        gothic: ['"Special Gothic Expanded One"', "sans-serif"],
        bitcount: ['"Bitcount Prop Double"', "system-ui"],
        playwrite: ['"Playwrite HU"', "cursive"],
        bebas: ['"Bebas Neue"', "sans-serif"],
        roboto: ['"Roboto"', "sans-serif"],
        slackside: ['"Slackside One"', "cursive"],
      },
      colors: {
        coffee: {
          100: "#f5f1ec",
          200: "#eae2d9",
          300: "#e0d4c5",
          350: "#d8cbbb",
          400: "#d6c6b2",
          450: "#ccbca8",
          500: "#cbb79f",
          550: "#bba891",
          600: "#a5937a",
          650: "#9A8773",
          700: "#8A7A67",
          750: "#736758",
          800: "#655B4F",
          850: "#403A33",
          900: "#31291F",
        },
        carrot: {
          100: "#fff2d1",
          200: "#ffe5a3",
          300: "#ffd875",
          400: "#ffcb47",
          500: "#ffbe1b",
          600: "#e0a100",
          700: "#a87900",
          750: "#956B03",
          800: "#705000",
          850: "#623C00",
          900: "#382800",
        },
        moss: {
          100: "#dadcd5",
          150: "#cdd3c3",
          200: "#b4b9ac",
          250: "#a9a898",
          300: "#82816F",
          350: "#6B685B",
          400: "#535247",
          450: "#46473C",
          500: "#38382E",
          550: "#393D33",
          600: "#36382E",
          650: "#2C2F27",
          700: "#282922",
          800: "#1a1c17",
          900: "#0d0e0c",
        },
      },
    },
  },
}
