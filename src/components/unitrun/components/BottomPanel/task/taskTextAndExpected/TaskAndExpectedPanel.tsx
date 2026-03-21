"use client";

import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import ExpectedOutPanel from "./components/ExpectedOutPanel";
import TaskPanel from "@/components/unitrun/components/BottomPanel/task/taskTextAndExpected/components/Taskpanel";

const TaskAndExpectedPanel = observer(() => {
  return (
    <Box
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        // height: "100%",
        flexGrow: 1,
        gap: 1,
      }}
    >
      <TaskPanel />
      <ExpectedOutPanel />
    </Box>
  );
});

export default TaskAndExpectedPanel;
