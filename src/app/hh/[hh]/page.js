"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import { useState, useEffect, useRef } from "react";
import Start from "./start";
import Test from "./test";
import Box from "@mui/material/Box";
import StartnTest from "./startnTest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function TestRunner({ params }) {
  const [tests, setTests] = useState([]);
  const [testsStarted, setTestsStarted] = useState(false);
  const darkTheme = createTheme({
    // palette: {
    //   mode: "dark",
    // },
    colorSchemes: {
      dark: true,
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <StartnTest chapter={params.chapter} />
      </Box>
    </ThemeProvider>
  );
}
