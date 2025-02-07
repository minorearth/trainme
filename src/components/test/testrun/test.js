"use client";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import usePythonRunner from "./withPythonRunner";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import LinearProgressWithLabel from "@/components/test/testrun/components/LinearProgress";
import useCheck from "./useCheck";
import useTest from "./useTest";
import CountdownButton from "@/components/common/countdown/CountdownButton";
import { observer } from "mobx-react-lite";
import cowntdownbutton from "@/store/cowntdownbutton";
import progressStore from "@/components/common/progress/progressStore";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import { useColorScheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";
import MonacoEd from "./components/monaco/MonacoEd";
import useMonaco from "./components/monaco/useMonaco";
import Animation from "@/components/common/animation/Animation";

const Test = observer(({ tests, actions, nav, pyodide }) => {
  const [executing, setExecuting] = useState(false);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const theme = useTheme();
  const { mode, setMode } = useColorScheme();
  const { setEditorDisabled } = useMonaco({});

  const {
    NextTaskOrCompleteTest,
    ErrorCountDownPressed,
    NextTaskAndAddRecapNoEffect,
    setOutput,
    setCode,
    currTask,
  } = useTest({
    nav,
    tests,
    editorRef,
    ...actions,
    setEditorDisabled: (disabled) => setEditorDisabled(disabled, editorRef),
  });

  const { runPythonCode } = usePythonRunner({ setOutput, pyodide });
  const { checkTask } = useCheck({
    NextTaskOrCompleteTest,
    NextTaskAndAddRecapNoEffect,
    runPythonCode,
    setCode,
    setEditorDisabled,
  });

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
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Animation height={"80px"} width={"80px"} name={"sheep"} />
          </Box>
          <LinearProgressWithLabel
            value={((nav.taskId + 1) / tests.length) * 100}
            label={`${nav.taskId + 1}\\${tests.length}`}
          />
          <DLSwitch monacoRef={monacoRef} />
        </Box>

        <Grid container spacing={2} columns={{ xs: 1, md: 3 }}>
          <Grid size={{ xs: 1, md: 1 }}>
            <Panel label={"Выполни задание"}>
              <Typography
                variant="body1"
                sx={{ display: "inline-block", whiteSpace: "pre-line" }}
              >
                {currTask.task}
              </Typography>
            </Panel>
          </Grid>
          <Grid size={{ xs: 1, md: 2 }}>
            <Panel label={"Редактор кода"}>
              <MonacoEd
                currTask={currTask}
                mode={mode}
                setCode={setCode}
                monacoRef={monacoRef}
                editorRef={editorRef}
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
                      ErrorCountDownPressed();

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
