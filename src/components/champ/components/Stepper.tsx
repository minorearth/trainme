import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { observer } from "mobx-react-lite";
import champ from "@/components/champ/layers/store/champ";

const steps = ["", "", ""];

const StepByStep = observer(() => {
  return (
    <Box sx={{ width: "100%", marginBottom: "50px" }}>
      <Stepper nonLinear activeStep={champ.activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
});

export default StepByStep;
