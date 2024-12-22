"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import { useState, useEffect, useRef } from "react";
import Start from "./start";
import Test from "./test";
import Box from "@mui/material/Box";

export default function StartnTest({
  navState,
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
      {!navState.inProgress && <Start setTestsStarted={setTestsInProgress} />}

      {navState.inProgress && (
        <Test
          nav={navState}
          tests={tests}
          setTaskInProgress={setTaskInProgress}
          interruptTest={interruptTest}
        />
      )}
    </Box>
  );
}
