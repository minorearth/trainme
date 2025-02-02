import { createTheme } from "@mui/material/styles";
import localFont from "next/font/local";
import { ruRU as coreruRU } from "@mui/material/locale";
import themeSwitchStore from "@/components/common/themeswitch/themeSwitchStore";
import { useEffect, useMemo, useState } from "react";
import { reaction } from "mobx";

const myFont = localFont({
  src: "./Monaco.ttf",
});

export const useCustomTheme = () => {
  const [darkTheme, setDarkTheme] = useState(() => themeSwitchStore.darkmode);

  useEffect(() => {
    // const darkTheme = setup != null ? setup.darktheme : true;
    // console.log("darkTheme", darkTheme);
    // themeSwitchStore.setDarkMode(darkTheme);
    setDarkTheme(themeSwitchStore.darkmode);
    reaction(
      () => themeSwitchStore.darkmode,
      (v) => {
        setDarkTheme(v);
      }
    );
  }, []);

  const customTheme = createTheme({
    typography: {
      body1: {
        fontFamily: myFont.style.fontFamily,
        // color: "#AAAAAA",
      },
    },

    // palette: {
    //   mode: "dark",
    //   background: { default: "#1E1E1E", paper: "#1E1E1E" },
    // },

    colorSchemes: {
      // dark: darkTheme,
      dark: false,
    },

    components: {
      // MuiCssBaseline: {
      //   styleOverrides: `
      //     @font-face {
      //       font-family: 'Monaco';
      //       font-style: normal;
      //       font-display: swap;
      //       font-weight: 400;
      //       src: local('Monaco'), local('Monaco-Regular'), url('/Monaco.ttf') format('ttf');
      //       unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      //     }
      //   `,
      // },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontFamily: myFont.style.fontFamily,
          },
        },
      },
    },
    coreruRU,
  });

  return { customTheme };
};

// const defaultTheme = useMemo(
//   () =>
//       createTheme({
//           palette: {
//               mode: appStore.colorMode,
//               text: {
//                   primary: appStore.colorMode === "light" ? "#000033" : "#FFF",
//               },
//               background: {
//                   default: appStore.colorMode === "light" ? "#E7EBF0" : "#121212",
//               },
//           },
//           shape: {
//               borderRadius: 4,
//           },
//       }),
//   [appStore.colorMode]
// );
