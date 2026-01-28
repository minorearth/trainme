"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import InOutPanel from "@/components/taskset/taskrun/components/BottomPanel/editor/edditorInout/InoutPanel/InOutPanel";
import TaskAndCodePanel from "@/components/taskset/taskrun/components/BottomPanel/BottomPanel";
import TopPanel from "@/components/taskset/taskrun/components/topPanel/TopPanel";
import BottomPanel from "@/components/taskset/taskrun/components/BottomPanel/BottomPanel";

const Taskrun = observer(() => {
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
      <TopPanel />
      <BottomPanel />
    </Box>
  );
});

export default Taskrun;
