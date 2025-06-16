"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import navigator from "@/components/Navigator/store/navigator";
import taskset from "@/components/taskset/store/taskset";

const getIntro = () => {
  if (taskset.state.nodemode == "textbook") {
    return "Приветствуем вас в учебнике 📘 ! В учебнике доступна теория только по открытым темам";
  }

  if (taskset.state.nodemode == "champ") {
    return "Удачи в чемпионате!";
  }

  if (!taskset.state.repeat) {
    return "Постарайтесь решить задачу с первого раза, за это начисляются монеты, которые используются для открытия новых уроков";
  }

  if (taskset.state.overflow) {
    return "Вы достигли лимита монет по этой главе😭, здесь вы уже их не заработаете🚫";
  }
  if (taskset.state.repeat) {
    return "В режиме повторения начисляется гораздо меньше монет";
  }
  if (taskset.state.overflow) {
    return "Вы достигли лимита монет по этой главе😭, здесь вы уже их не заработаете🚫";
  }
};

export default function Start() {
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
          navigator.actions.openLessonRunPage();
        }}
        variant="outlined"
      >
        {taskset.state.repeat ? "Повторяем урок" : "Начать"}
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
        {/* //TODO:fd */}
        {getIntro()}
      </Typography>
    </Box>
  );
}
