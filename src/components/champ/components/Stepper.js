import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["", "", ""];

export default function StepByStep({ activeStep, setActiveStep }) {
  return (
    <Box sx={{ width: "100%", marginBottom: "50px" }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
