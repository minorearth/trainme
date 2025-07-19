"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";

//components
import AvatarSelector from "@/components/champ/components/avatar/AvaCrd";
import CustomField from "@/components/common/customfield/customField";

//stores
import txtField from "@/components/common/customfield/store";
import champ from "@/components/champ/layers/store/champ";
import L from "@/globals/local";

const AvatarStep = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <CustomField type={"nickname"} />
      <AvatarSelector />

      <Button
        sx={{ width: "30%" }}
        onClick={() => {
          champ.setActiveStep(1);
        }}
        disabled={txtField.state.nickname.error}
        variant="outlined"
        fullWidth
      >
        {L.ru.buttons.NEXT_TASK}
      </Button>
    </Box>
  );
});

export default AvatarStep;
