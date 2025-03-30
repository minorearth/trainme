"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Animation from "@/components/common/animation/Animation";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";
import TextAnimated from "@/components/common/textAnimated/textAnimated";
import { useEffect, useState } from "react";
import { getCSP } from "@/db/localstorage";

let pts;
const CongratPage = ({ appState, actionsNAV }) => {
  const [pts, setPts] = useState(10);
  useEffect(() => {
    const { pts } = getCSP();
    setPts(pts);
  }, []);

  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: window.innerHeight,
        alignItems: "center",
        justifyContent: "center",
        transition: "padding 5s",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Animation width={"700px"} height={"700px"} name={"success"} />
      <Box sx={{}}></Box>
      {pts != 0 && <TextAnimated text={`Заработанные монеты: ${pts} `} />}

      <Button
        sx={{ mt: 3, mb: 3 }}
        variant="outlined"
        aria-label="repeat"
        onClick={async () => {
          if (
            appState.nodemode == "addhoc" ||
            appState.nodemode == "newtopic" ||
            appState.nodemode == "renewal"
          ) {
            actionsNAV.openFlowPageAfterAccomplished();
          }

          if (appState.nodemode == "champ") {
            actionsNAV.openSpecChampPage({ champid: appState.champid });
          }

          // setFlowPage();
        }}
        endIcon={<ReplayIcon />}
      >
        {"Вернуться к курсу"}
      </Button>
    </Box>
  );
};

export default CongratPage;
