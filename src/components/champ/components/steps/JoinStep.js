"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";

//components
import CustomField from "@/components/common/customfield/customField";

//stores
import champ from "@/components/champ/layers/store/champ";

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
        type={"champid"}
        stateChanger={(value) => champ.setChampIdP(value)}
      />

      <Button
        disabled={!champ.champid}
        variant="outlined"
        onClick={() => champ.actions.joinChamp()}
        fullWidth
      >
        Присоединиться
      </Button>
      <Button
        sx={{ width: "30%" }}
        onClick={() => {
          champ.setActiveStep(1);
        }}
        variant="outlined"
        fullWidth
      >
        Назад
      </Button>
    </Box>
  );
});

export default JoinStep;
