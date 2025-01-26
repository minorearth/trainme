"use client";
import { createTheme } from "@mui/material/styles";

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
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "Monaco",
        },
      },
    },
  },
});
