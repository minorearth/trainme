"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import InOutPanel from "@/components/taskset/taskrun/components/InOutPanel";
import TaskAndCodePanel from "@/components/taskset/taskrun/components/taskAndCodePanel";
import TopPanel from "@/components/taskset/taskrun/components/TopPanel";

const Guide = observer(() => {
  const theme = useTheme();

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
      {/* <TopPanel /> */}
      <TaskAndCodePanel />
      <InOutPanel />
    </Box>
  );
});

export default Guide;
