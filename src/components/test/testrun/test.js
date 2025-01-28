"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import { useTheme } from "@mui/material/styles";

import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import { EditorOptions } from "@/components/test/monaco/MonacoEditorOptions";
import Typography from "@mui/material/Typography";
import usePythonRunner from "./withPythonRunner";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import LinearProgressWithLabel from "@/components/test/testrun/components/LinearProgress";
import useCheck from "./useCheck";
import useTest from "./useTest";
import Progress from "@/components/common/progress/progress";
import CountdownButton from "@/components/common/countdown/CountdownButton";
import { observer } from "mobx-react-lite";
import cowntdownbutton from "@/store/cowntdownbutton";

const Test = observer(({ tests, actions, nav }) => {
  const [executing, setExecuting] = useState(false);
  const [editorDarkMode, setEditorDarkMode] = useState("darkMode");
  const theme = useTheme();
  const {
    NextTaskOrCompleteTest,
    ErrorCountDownPressed,
    NextTaskAndAddRecapNoEffect,
    currTask,
    setCode,
    setOutput,
    setEditorDisabled,
    handleEditorDidMount,
    getSense,
  } = useTest({
    nav,
    tests,
    ...actions,
  });

  const { pyodide2, runPythonCode } = usePythonRunner({ setOutput });
  const { checkTask } = useCheck({
    NextTaskOrCompleteTest,
    NextTaskAndAddRecapNoEffect,
    runPythonCode,
    setCode,
    setEditorDisabled,
  });

  return (
    pyodide2 && (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
          padding: "5px",
        }}
      >
        <LinearProgressWithLabel
          value={((nav.taskId + 1) / tests.length) * 100}
          label={`${nav.taskId + 1}\\${tests.length}`}
        />

        <Box>
          <Paper elevation={0} sx={{ padding: "3px" }}>
            <Typography variant="body1" gutterBottom>
              {currTask.task}
            </Typography>
          </Paper>
          <TextField
            sx={{
              width: "100%",
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            id="outlined-multiline-static"
            label="Входные данные"
            multiline
            rows={4}
            value={currTask.input}
            onChange={(event) => {
              // setInput(event.target.value);
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
            onClick={async (e) => {
              if (!pyodide2 || executing) return;
              setExecuting(true);
              await runPythonCode(currTask.code, currTask.input);
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

          {!cowntdownbutton.state.visible && (
            <Button
              onClick={async (e) => {
                if (!pyodide2 || executing) return;
                checkTask(currTask.code, tests[nav.taskId], tests.length);
              }}
              disabled={!pyodide2 || executing}
              variant="outlined"
            >
              Проверить!
            </Button>
          )}
          {cowntdownbutton.state.visible && (
            <CountdownButton
              onClick={() => {
                // NextTaskOrCompleteTest({ error: false });
                ErrorCountDownPressed();
                setEditorDisabled(false);
                cowntdownbutton.hideButton();
              }}
              variant="outlined"
            />
          )}
          <Button
            onClick={() => {
              actions.setTestInterrupted();
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
            value={currTask.code}
            onChange={(value, e) => setCode(value ?? "")}
            onMount={handleEditorDidMount}
          />
        </Box>
        <Paper elevation={0}>
          <Typography variant="body1" gutterBottom>
            {currTask.restrictErrors}
          </Typography>
          <Box
            sx={{
              width: "100%",
              // padding: "5px",
              display: "flex",
              flexDirection: "row",

              justifyContent: "space-around",
            }}
          >
            <TextField
              sx={{
                width: "100%",
                flex: 1,
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              id="output"
              label="Выходные данные"
              multiline
              rows={4}
              value={currTask.output}
            />
            <TextField
              sx={{
                width: "100%",
                flex: 1,
                typography: "body1",
              }}
              // inputProps={{
              //   style: {
              //     color: "#405D72",
              //     fontSize: 20,
              //     // fontStyle: "italic",
              //     // fontWeight: "bold",
              //     // fontFamily: myFont.style.fontFamily,
              //   },
              // }}
              slotProps={{
                htmlInput: {
                  style: {
                    // fontFamily: `Monaco`,
                    // fontFeatureSettings: `"liga" 0, "calt" 0`,
                  },
                },
                inputLabel: {
                  shrink: true,
                },
              }}
              id="expected"
              label="Ожидаемый результат"
              multiline
              rows={4}
              value={currTask.expectedOutput}
            />
          </Box>
        </Paper>
      </Box>
    )
  );
});

export default Test;
