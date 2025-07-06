"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

//components
import RangeSlider from "@/components/champ/components/RangeSlider";
import CustomField from "@/components/common/customfield/customField";

//stores
import champ from "@/components/champ/layers/store/champ";
import txtField from "@/components/common/customfield/store";

const CreateChampStep = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <>
        <Typography>Сложность</Typography>
        <RangeSlider />
      </>
      <CustomField
        type={"tasknum"}
        sx={{
          "& .MuiInputBase-input": {
            textAlign: "center",
            fontSize: "24px",
          },
        }}
      />

      <Button
        disabled={txtField.state.tasknum.error}
        onClick={() => {
          champ.actions.createChamp();
          champ.setActiveStep(2);
          champ.setCreateMode(true);
        }}
        variant="outlined"
        fullWidth
      >
        Создать чемпионат
      </Button>

      {champ.champid && <Typography variant="h4">{champ.champid}</Typography>}
      <Button
        disabled={!champ.champid}
        onClick={() => champ.actions.startChamp(champ.champid)}
        variant="outlined"
        fullWidth
      >
        Начать
      </Button>
      <Button
        disabled={!champ.champid}
        variant="outlined"
        onClick={() => {
          champ.actions.joinChamp();
        }}
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

export default CreateChampStep;
