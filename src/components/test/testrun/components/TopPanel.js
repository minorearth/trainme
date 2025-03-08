"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgressWithLabel from "@/components/test/testrun/components/LinearProgress";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import Animation from "@/components/common/animation/Animation";
import Typography from "@mui/material/Typography";
const TopPanel = ({ tests, appState, monacoRef }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Animation height={"80px"} width={"80px"} name={"sheep"} />
      <LinearProgressWithLabel
        value={((appState.taskId + 1) / tests.length) * 100}
        label={`${appState.taskId + 1}\\${tests.length}`}
      />
      <Animation height={"50px"} width={"50px"} name={"coins"} />
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontSize: 22 }}
      >
        {appState.pts}
      </Typography>

      <DLSwitch monacoRef={monacoRef} />
    </Box>
  );
};

export default TopPanel;
