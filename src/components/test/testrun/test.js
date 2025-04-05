"use client";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import usePythonRunner from "./withPythonRunner";
import Box from "@mui/material/Box";
import useCheck from "./useCheck";
import useTest from "./useTest";
import { observer } from "mobx-react-lite";
import progressStore from "@/components/common/progress/progressStore";
import useMonaco from "./components/monaco/useMonaco";
import InOutPanel from "@/components/test/testrun/components/InOutPanel";
import TaskAndCodePanel from "@/components/test/testrun/components/taskAndCodePanel";
import TopPanel from "@/components/test/testrun/components/TopPanel";

const Test = observer((props) => {
  const { appState, tests, actionsNAV, pyodide } = props;
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const theme = useTheme();

  const { setEditorDisabled } = useMonaco({ monacoRef, editorRef });

  const { actionsTsk, currTask, monacoInfo } = useTest({
    appState,
    tests,
    actionsNAV,
    editorRef,
    setEditorDisabled: (disabled) => setEditorDisabled(disabled, editorRef),
  });

  const { runPythonCode } = usePythonRunner({
    updateCurrTask: actionsTsk.updateCurrTask,
    pyodide,
  });
  const { checkTask } = useCheck({ actionsTsk, runPythonCode });

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
          padding: "6px",
        }}
      >
        <TopPanel tests={tests} appState={appState} monacoRef={monacoRef} />

        <TaskAndCodePanel
          pyodide={pyodide}
          actionsTsk={actionsTsk}
          actionsNAV={actionsNAV}
          currTask={currTask}
          appState={appState}
          tests={tests}
          checkTask={checkTask}
          runPythonCode={runPythonCode}
          monacoRef={monacoRef}
          editorRef={editorRef}
          monacoInfo={monacoInfo}
        />
        <InOutPanel
          currTask={currTask}
          refreshInput={actionsTsk.refreshInput}
        />
      </Box>
    )
  );
});

export default Test;
