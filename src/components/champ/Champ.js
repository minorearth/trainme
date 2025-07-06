"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";

//components
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";
import StepByStep from "@/components/champ/components/Stepper";
import AvatarStep from "@/components/champ/components/steps/avatarstep";
import CreateOrJoinStep from "@/components/champ/components/steps/createorJoinStep";
import CreateChampStep from "@/components/champ/components/steps/CreateChamp";
import JoinStep from "@/components/champ/components/steps/JoinStep";

//stores
import champ from "@/components/champ/layers/store/champ";

const Champ = observer(() => {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        overflow: "auto",
        width: "100%",
        flexDirection: "row",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          width: "30%",
          flexDirection: "column",
          margin: "10px",
          padding: "40px",
          justifyContent: "center",
        }}
      >
        <StepByStep />
        {champ.activeStep === 0 && <AvatarStep />}
        {champ.activeStep === 1 && <CreateOrJoinStep />}
        {champ.activeStep === 2 && champ.createMode && <CreateChampStep />}
        {!champ.createMode && champ.activeStep === 2 && <JoinStep />}
      </Box>
      {champ.champid && (
        <Box
          sx={{
            display: "flex",
            overflow: "auto",
            width: "70%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SortableList />
        </Box>
      )}
    </Box>
  );
});

export default Champ;
