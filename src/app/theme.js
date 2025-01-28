"use client";
import { createTheme } from "@mui/material/styles";
// import Monaco from "/Monaco.ttf";

// https://zenoo.github.io/mui-theme-creator/
export const darkTheme = createTheme({
  typography: {
    body1: {
      fontFamily: "Monaco",
    },
  },

  palette: {
    mode: "dark",
    background: { default: "#1E1E1E", paper: "#1E1E1E" },
  },
  colorSchemes: {
    dark: true,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Monaco';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Monaco'), local('Monaco-Regular'), url('Monaco.ttf') format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "Monaco",
        },
      },
    },
  },
});
