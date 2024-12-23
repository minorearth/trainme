"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import { useTheme } from "@mui/material/styles";

import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import { EditorOptions } from "@/components/test/monaconfig/MonacoEditorOptions";
import Typography from "@mui/material/Typography";
import usePythonRunner from "./withPythonRunner";
import TextField from "@mui/material/TextField";
import { stn } from "@/constants";
import { testsall } from "@/app/data";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { saveProgress } from "@/app/db/domain";
import LinearProgressWithLabel from "@/components/LinearProgress";

// const TextField = styled(TextFieldUnstyled)({
//   "& label": {
//     color: "white",
//   },
//   "& label.Mui-focused": {
//     color: "white",
//     borderColor: "white",
//   },
//   "& .MuiInput-underline:after": {
//     color: "white",
//     borderBottomColor: "white",
//   },
//   "& .MuiOutlinedInput-root": {
//     color: "white",

//     "& fieldset": {
//       borderColor: "white",
//       color: "white",
//     },
//     color: "white",

//     "&:hover fieldset": {
//       borderColor: "white",
//       color: "white",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "white",
//       color: "white",
//     },
//   },
// });
//..

const eq = (a, b) => {
  return a.every((val, idx) => val === b[idx]);
};

export default function Test({
  tests,
  setTaskInProgress,
  nav,
  interruptTest,
  setCongrat,
}) {
  const [code, setCode] = useState("");
  const [taskText, setTaskText] = useState("");
  const [done, setDone] = useState("");
  const [restrictErrors, setRestrictErrors] = useState("");
  const [executing, setExecuting] = useState(false);
  const [editorDarkMode, setEditorDarkMode] = useState("darkMode");
  const theme = useTheme();
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
      if (nav.taskId != tests.length - 1) {
        setTaskInProgress(nav.taskId + 1);
      } else {
        saveProgress({ chapter: nav.chapter, errors: 0 });
        setCongrat();
      }
    }

    // return codeChecked && linesChecked && mustHaveChecked;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        margin: "2px",
        padding: "5px",
      }}
    >
      <LinearProgressWithLabel value={(nav.taskId / tests.length) * 100} />
      <Box>
        {/* <Box sx={{ color: "white" }}> */}
        <Paper elevation={0} sx={{ padding: "3px" }}>
          <Typography variant="body1" gutterBottom>
            {taskText}
          </Typography>
        </Paper>
        <TextField
          sx={{
            width: "100%",
            // "&.MuiOutlinedInput-root": {
            //   borderColor: "white",
            // },
          }}
          // slotProps={{
          //   htmlInput: {
          //     style: {
          //       color: "white",
          //       // fontSize: 20,
          //     },
          //   },
          // }}
          id="outlined-multiline-static"
          label="Входные данные"
          multiline
          rows={4}
          value={stdIn}
          onChange={(event) => {
            setStdIn(event.target.value);
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",

          padding: "5px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Button
          // sx={{ color: "white" }}
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
            // setDone((await checkTask(nav.taskId)) ? "ok" : "wrong");
            await checkTask(nav.taskId);
          }}
          variant="outlined"
        >
          Проверить!
        </Button>
        <Button
          onClick={() => {
            interruptTest();
          }}
          variant="outlined"
        >
          Выйти
        </Button>
      </Box>
      <Box
        sx={{
          border: "1px solid #525252",
          borderRadius: "2px",
          marginBottom: "5px",
        }}
      >
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
      </Box>
      <Paper elevation={0}>
        {/* <Typography variant="body1" gutterBottom>
            {done}
          </Typography> */}
        <Typography variant="body1" gutterBottom>
          {restrictErrors}
        </Typography>
        <pre>
          <TextField
            sx={{
              width: "100%",
            }}
            id="outlined-multiline-static"
            label="Выходные данные"
            multiline
            rows={4}
            value={consoleOutput2}
          />
          {/* <Box component="fieldset">
              <legend>Jean-François H</legend>
              <Typography variant="body1" gutterBottom>
                {consoleOutput2}
              </Typography>
            </Box> */}
        </pre>
      </Paper>
    </Box>
  );
}
