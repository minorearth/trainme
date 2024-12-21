"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import { useState, useEffect, useRef } from "react";
import Start from "./start";
import Test from "./test";
import Box from "@mui/material/Box";

export default function StartnTest({
  nav,
  setTestsInProgress,
  tests,
  setTaskInProgress,
  interruptTest,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      {!nav.inProgress && <Start setTestsStarted={setTestsInProgress} />}

      {nav.inProgress && (
        <Test
          nav={nav}
          tests={tests}
          setTaskInProgress={setTaskInProgress}
          interruptTest={interruptTest}
        />
      )}
    </Box>
  );
}
