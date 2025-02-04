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
import progressStore from "@/components/common/progress/progressStore";
import themeSwitch from "@/components/common/themeswitch/themeSwitchStore";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import { useColorScheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";

const Test = observer(({ tests, actions, nav, pyodide }) => {
  const [executing, setExecuting] = useState(false);
  // const [editorDarkMode, setEditorDarkMode] = useState("darkMode");
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
    monacoRef,
  } = useTest({
    nav,
    tests,
    ...actions,
  });

  const { runPythonCode } = usePythonRunner({ setOutput, pyodide });
  const { checkTask } = useCheck({
    NextTaskOrCompleteTest,
    NextTaskAndAddRecapNoEffect,
    runPythonCode,
    setCode,
    setEditorDisabled,
  });

  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  useEffect(() => {
    progressStore.setCloseProgress();
  }, []);

  return (
    pyodide && (
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <LinearProgressWithLabel
            value={((nav.taskId + 1) / tests.length) * 100}
            label={`${nav.taskId + 1}\\${tests.length}`}
          />
          <DLSwitch monacoRef={monacoRef} />
        </Box>

        <Grid container spacing={2} columns={{ xs: 1, md: 3 }}>
          <Grid size={{ xs: 1, md: 1 }}>
            <Panel label={"Выполни задание"}>
              <Typography variant="body1" gutterBottom>
                {currTask.task}
              </Typography>
            </Panel>
          </Grid>
          <Grid size={{ xs: 1, md: 2 }}>
            <Panel label={"Редактор кода"}>
              <Editor
                height="50vh"
                width="100%"
                theme={"pk"}
                options={EditorOptions}
                language="python"
                value={currTask.code}
                onChange={(value, e) => setCode(value ?? "")}
                onMount={(editor, monaco) =>
                  handleEditorDidMount({
                    editor,
                    monaco,
                    darkmode: mode == "dark" ? true : false,
                  })
                }
              />

              <Box
                sx={{
                  width: "100%",
                  marginTop: "15px",
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  onClick={async (e) => {
                    if (!pyodide || executing) return;
                    setExecuting(true);
                    await runPythonCode(currTask.code, currTask.input);
                    setExecuting(false);
                  }}
                  variant="outlined"
                  disabled={!pyodide || executing}
                >
                  {!pyodide
                    ? "Загружается..."
                    : executing
                    ? "Выполняется..."
                    : "Выполнить"}
                </Button>

                {!cowntdownbutton.state.visible && (
                  <Button
                    onClick={async (e) => {
                      if (!pyodide || executing) return;
                      checkTask(currTask.code, tests[nav.taskId], tests.length);
                    }}
                    disabled={!pyodide || executing}
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
                {/* <Button
                  onClick={() => {
                    actions.setTestInterrupted();
                  }}
                  variant="outlined"
                >
                  Выйти
                </Button> */}
              </Box>
            </Panel>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          columns={{ xs: 1, sm: 3 }}
          sx={{ marginTop: "10px", flexGrow: 1 }}
        >
          <Grid size={{ xs: 1, md: 1 }}>
            <Panel label={"Входные данные"}>
              <pre>
                <Typography variant="body1" gutterBottom>
                  {currTask.input}
                </Typography>
              </pre>
            </Panel>
          </Grid>
          <Grid size={{ xs: 1, md: 1 }}>
            <Panel label={"Выходные данные"}>
              <pre>
                <Typography variant="body1" gutterBottom>
                  {currTask.output}
                </Typography>
              </pre>
            </Panel>
          </Grid>
          <Grid size={{ xs: 1, md: 1 }}>
            <Panel label={"Ожидаемый результат"}>
              <pre>
                <Typography variant="body1" gutterBottom>
                  {currTask.expectedOutput}
                </Typography>
              </pre>
            </Panel>
          </Grid>
        </Grid>
      </Box>
    )
  );
});

export default Test;
