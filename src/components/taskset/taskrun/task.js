"use client";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import usePythonRunner from "./pythonRunner";
import Box from "@mui/material/Box";
import useCheck from "./useCheck";
import { observer } from "mobx-react-lite";
import progressStore from "@/components/common/splash/progressdots/store";
import InOutPanel from "@/components/taskset/taskrun/components/InOutPanel";
import TaskAndCodePanel from "@/components/taskset/taskrun/components/taskAndCodePanel";
import TopPanel from "@/components/taskset/taskrun/components/TopPanel";
import "./custom.css";

const Task = observer(() => {
  const theme = useTheme();

  useEffect(() => {
    progressStore.setCloseProgress();
  }, []);

  return (
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
      <TaskAndCodePanel />
      <InOutPanel />
    </Box>
  );
});

export default Task;
