"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export default function Start({ actions, nav }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Button
        onClick={() => {
          actions.changeState({ data: { page: "testrun" } });
        }}
        variant="outlined"
      >
        Начать урок
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        {nav.repeat ? "Повторение" : "Новьё"}
      </Typography>
    </Box>
  );
}
