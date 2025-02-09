"use client";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import usePythonRunner from "./withPythonRunner";
import Box from "@mui/material/Box";
import LinearProgressWithLabel from "@/components/test/testrun/components/LinearProgress";
import useCheck from "./useCheck";
import useTest from "./useTest";
import { observer } from "mobx-react-lite";
import progressStore from "@/components/common/progress/progressStore";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import { useColorScheme } from "@mui/material/styles";
import useMonaco from "./components/monaco/useMonaco";
import Animation from "@/components/common/animation/Animation";
import InOutPanel from "@/components/test/testrun/components/InOutPanel";
import TaskAndCodePanel from "@/components/test/testrun/components/taskAndCodePanel";
import TopPanel from "@/components/test/testrun/components/TopPanel";

const Test = observer(({ tests, actions, nav, pyodide }) => {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { setEditorDisabled } = useMonaco({ monacoRef, editorRef });

  const testFeed = useTest({
    nav,
    tests,
    editorRef,
    ...actions,
    setEditorDisabled: (disabled) => setEditorDisabled(disabled, editorRef),
  });

  const { setOutput, currTask } = testFeed;
  const { runPythonCode } = usePythonRunner({ setOutput, pyodide });
  const { checkTask } = useCheck({ ...testFeed, runPythonCode });

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
        <TopPanel tests={tests} nav={nav} monacoRef={monacoRef} />

        <TaskAndCodePanel
          {...testFeed}
          checkTask={checkTask}
          runPythonCode={runPythonCode}
          mode={mode}
          monacoRef={monacoRef}
          editorRef={editorRef}
          pyodide={pyodide}
          nav={nav}
          tests={tests}
          actions={actions}
        />
        <InOutPanel currTask={currTask} />
      </Box>
    )
  );
});

export default Test;
