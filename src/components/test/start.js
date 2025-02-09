"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import progressStore from "../common/progress/progressStore";
import Paper from "@mui/material/Paper";

export default function Start({ actions, nav }) {
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

          actions.changeState({ data: { page: "testrun", pts: 0 } });
        }}
        variant="outlined"
      >
        {nav.repeat ? "Повторяем урок" : "Начать урок"}
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
        {!nav.repeat
          ? "Постарайтесь решить задачу с первого раза, за это начисляются монеты, которые используются для открытия новых уроков"
          : nav.overflow
          ? "Вы достигли лимита монет по этой главе😭, здесь вы уже их не заработаете🚫"
          : "В режиме повторения начисляется гораздо меньше монет"}
      </Typography>
    </Box>
  );
}
