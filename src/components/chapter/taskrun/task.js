"use client";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import usePythonRunner from "./pythonRunner";
import Box from "@mui/material/Box";
import useCheck from "./useCheck";
import useTask from "./useTask";
import { observer } from "mobx-react-lite";
import progressStore from "@/components/common/splash/progressdots/store";
import useMonaco from "./components/monaco/useMonaco";
import InOutPanel from "@/components/chapter/taskrun/components/InOutPanel";
import TaskAndCodePanel from "@/components/chapter/taskrun/components/taskAndCodePanel";
import TopPanel from "@/components/chapter/taskrun/components/TopPanel";

const Task = observer(({ pyodide }) => {
  const theme = useTheme();
  useTask();

  const { runPythonCode } = usePythonRunner({
    pyodide,
  });

  const { checkTask, runTask } = useCheck({
    runPythonCode,
  });

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
        <TopPanel />

        <TaskAndCodePanel checkTask={checkTask} runTask={runTask} />
        <InOutPanel />
      </Box>
    )
  );
});

export default Task;
