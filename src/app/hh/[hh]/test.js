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

const eq = (a, b) => {
  return a.every((val, idx) => val === b[idx]);
};

export default function Test({ tests, setTaskInProgress, nav }) {
  const [code, setCode] = useState("");
  const [taskText, setTaskText] = useState("");
  const [done, setDone] = useState("");
  const [restrictErrors, setRestrictErrors] = useState("");
  const [executing, setExecuting] = useState(false);
  const [editorDarkMode, setEditorDarkMode] = useState("darkMode");
  const { pyodide2, runPythonCode, consoleOutput2, setStdIn, stdIn } =
    usePythonRunner();

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  useEffect(() => {
    setTask(nav.taskId);
  }, [nav]);

  const setTask = (id) => {
    const test = tests[id];
    setTaskText(test.task);
    setStdIn(test.defaultinput.join("\n"));
    setCode(test.defaultcode);
  };

  const cleanUpCode = (code) => {
    const codeLines = code
      .split("\n")
      .map((line) => line.replace(/#.*/g, "").replace(/[\n\t ]/g, ""))
      .filter((line) => line != "");
    return codeLines;
  };

  // [[].*for.*in.*[]]
  const checkLines = (code, maxlines) => {
    const codeLines = cleanUpCode(code);
    return maxlines >= codeLines.length;
  };

  const checkMustHave = (code, musthave) => {
    const codeLines = cleanUpCode(code).join();
    return musthave.map((item) => codeLines.includes(item)).every(Boolean);
  };

  const checkCode = async (code, test) => {
    const results = await Promise.all(
      test.inout.map(async (check) => {
        const output = await runPythonCode(code, check.inv.join("\n"));
        return eq(output, check.outv);
      })
    );
    return results.every(Boolean);
  };

  const checkTask = async (id) => {
    const test = tests[id];
    const codeChecked = await checkCode(code, test);
    const linesChecked = checkLines(code, test.restrictions.maxlines);
    const mustHaveChecked = checkMustHave(code, test.restrictions.musthave);

    [!mustHaveChecked, codeChecked, linesChecked].every(Boolean) &&
      setRestrictErrors(stn.errors.error1);

    [mustHaveChecked, codeChecked, !linesChecked].every(Boolean) &&
      setRestrictErrors(stn.errors.error2);

    [!mustHaveChecked, codeChecked, !linesChecked].every(Boolean) &&
      setRestrictErrors(stn.errors.error3);

    [!codeChecked].every(Boolean) && setRestrictErrors(stn.errors.error4);

    [codeChecked && linesChecked && mustHaveChecked].every(Boolean) &&
      setRestrictErrors("");

    if (codeChecked && linesChecked && mustHaveChecked) {
      // clean up undo stack
      editorRef.current.getModel().setValue("");
      setTaskInProgress(nav.taskId + 1);
    }

    return codeChecked && linesChecked && mustHaveChecked;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <Typography variant="body1" gutterBottom>
          {taskText}
        </Typography>
        <TextField
          sx={{ width: "100%" }}
          id="outlined-multiline-static"
          label="Входные данные"
          multiline
          rows={4}
          value={stdIn}
          onChange={(event) => {
            setStdIn(event.target.value);
          }}
        />
        <Box
          sx={{
            width: "100%",
            margin: "10px",
            padding: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            onClick={async (e) => {
              if (!pyodide2 || executing) return;
              setExecuting(true);
              runPythonCode(code, stdIn);
              setExecuting(false);
            }}
            variant="outlined"
            disabled={!pyodide2 || executing}
          >
            {!pyodide2
              ? "Загружается..."
              : executing
              ? "Выполняется..."
              : "Выполнить"}
          </Button>

          <Button
            onClick={async (e) => {
              setDone((await checkTask(nav.taskId)) ? "ok" : "wrong");
            }}
            variant="outlined"
          >
            Проверить!
          </Button>
          <Button onClick={() => {}} variant="outlined">
            Выйти
          </Button>
        </Box>
        <Editor
          height="50vh"
          width="100%"
          theme={editorDarkMode ? "vs-dark" : "vs"}
          options={EditorOptions}
          language="python"
          value={code}
          onChange={(value, e) => setCode(value ?? "")}
          onMount={handleEditorDidMount}
        />
        <Typography variant="body1" gutterBottom>
          {done}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {restrictErrors}
        </Typography>
        <pre>
          <Typography variant="body1" gutterBottom>
            {consoleOutput2}
          </Typography>
        </pre>
      </Box>
    </Box>
  );
}
