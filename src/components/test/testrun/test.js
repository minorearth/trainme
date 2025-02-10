"use client";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import usePythonRunner from "./withPythonRunner";
import Box from "@mui/material/Box";
import useCheck from "./useCheck";
import useTest from "./useTest";
import { observer } from "mobx-react-lite";
import progressStore from "@/components/common/progress/progressStore";
import { useColorScheme } from "@mui/material/styles";
import useMonaco from "./components/monaco/useMonaco";
import InOutPanel from "@/components/test/testrun/components/InOutPanel";
import TaskAndCodePanel from "@/components/test/testrun/components/taskAndCodePanel";
import TopPanel from "@/components/test/testrun/components/TopPanel";

const Test = observer((props) => {
  const { pyodide } = props;
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { setEditorDisabled } = useMonaco({ monacoRef, editorRef });

  const testFeed = useTest({
    ...props,
    editorRef,
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
        <TopPanel {...props} monacoRef={monacoRef} />

        <TaskAndCodePanel
          {...testFeed}
          {...props}
          checkTask={checkTask}
          runPythonCode={runPythonCode}
          mode={mode}
          monacoRef={monacoRef}
          editorRef={editorRef}
        />
        <InOutPanel currTask={currTask} />
      </Box>
    )
  );
});

export default Test;
