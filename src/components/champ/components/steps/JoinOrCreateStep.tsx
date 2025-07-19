"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";

import champ from "@/components/champ/layers/store/champ";
import L from "@/globals/local";

const CreateOrJoinStep = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <Button
        onClick={() => {
          champ.setActiveStep(2);
          champ.setCreateMode(true);
        }}
        variant="outlined"
        fullWidth
      >
        {L.ru.buttons.CREATE_CHAMP}
      </Button>

      <Button
        sx={{ marginBottom: "10px" }}
        variant="outlined"
        onClick={() => {
          champ.setActiveStep(2);
          champ.setCreateMode(false);
        }}
        fullWidth
      >
        {L.ru.buttons.JOINCHAMP}
      </Button>

      <Button
        sx={{ width: "30%" }}
        onClick={() => {
          champ.setActiveStep(0);
        }}
        variant="outlined"
        // fullWidth
      >
        {L.ru.buttons.BACK_CHAMP}
      </Button>
    </Box>
  );
});

export default CreateOrJoinStep;
