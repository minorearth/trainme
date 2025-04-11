"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import progressStore from "../common/progress/progressStore";
import Paper from "@mui/material/Paper";

const getIntro = (appState) => {
  if (appState.nodemode == "textbook") {
    return "Приветствуем вас в учебнике 📘 ! В учебнике доступна теория только по открытым темам";
  }

  if (!appState.repeat) {
    return "Постарайтесь решить задачу с первого раза, за это начисляются монеты, которые используются для открытия новых уроков";
  }
  if (appState.repeat) {
    return "В режиме повторения начисляется гораздо меньше монет";
  }
  if (appState.overflow) {
    return "Вы достигли лимита монет по этой главе😭, здесь вы уже их не заработаете🚫";
  }
};

export default function Start({ actionsNAV, appState }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        justifyItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Button
        onClick={() => {
          progressStore.setShowProgress(true, false, "progressdots", 2000);
          //checked updateStateAndCSP
          actionsNAV.updateStateAndCSP({ page: "testrun" });
        }}
        variant="outlined"
      >
        {appState.repeat ? "Повторяем урок" : "Начать"}
      </Button>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          maxWidth: "600px",
          width: "70%",
          marginTop: "20px",
        }}
      >
        {getIntro(appState)}
      </Typography>
    </Box>
  );
}
