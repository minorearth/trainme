"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/

//react stuff
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import unitset from "@/components/unitset/layers/store/unitset";

import { L } from "@/tpconst/src/lang";

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
          navigator.actions.openUnitSetPage();
        }}
        variant="outlined"
      >
        {L.ru.buttons.START}
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
        {unitset.startPageIntro()}
      </Typography>
    </Box>
  );
}
