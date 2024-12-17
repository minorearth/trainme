"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import { EditorOptions } from "@/app/hh/[hh]/monaconfig/MonacoEditorOptions";
import Typography from "@mui/material/Typography";
import usePythonRunner from "./withPythonRunner";
import TextField from "@mui/material/TextField";
import { stn } from "@/constants";
import { testsall } from "@/app/data";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Start({
  nav,
  setTests,
  tests,
  setTestsStarted,
  getTests,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        justifyItems: "center",
      }}
    >
      <Button
        onClick={() => {
          setTestsStarted();
        }}
        variant="outlined"
      >
        Начать урок
      </Button>
    </Box>
  );
}
