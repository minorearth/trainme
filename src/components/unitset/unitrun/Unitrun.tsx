"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import TopPanel from "@/components/unitset/unitrun/components/topPanel/TopPanel";
import BottomPanel from "@/components/unitset/unitrun/components/BottomPanel/BottomPanel";

const Unitrun = observer(() => {
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

export default Unitrun;
