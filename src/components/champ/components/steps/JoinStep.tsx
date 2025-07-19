"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";

//components
import CustomField from "@/components/common/customfield/customField";

//stores
import champ from "@/components/champ/layers/store/champ";
import L from "@/globals/local";
import { CFT } from "@/components/common/customfield/types";

const JoinStep = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <CustomField
        type={CFT.champid}
        onChangeAction={(value) => champ.setChampIdP(value)}
      />

      <Button
        disabled={!champ.champid}
        variant="outlined"
        onClick={() => champ.actions.joinChamp()}
        fullWidth
      >
        {L.ru.buttons.JOINCHAMP}
      </Button>
      <Button
        sx={{ width: "30%" }}
        onClick={() => {
          champ.setActiveStep(1);
        }}
        variant="outlined"
        fullWidth
      >
        {L.ru.buttons.BACK_CHAMP}
      </Button>
    </Box>
  );
});

export default JoinStep;
