import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import { useTheme } from "@mui/material";

export const Panel = ({ children, label }) => {
  const theme = useTheme();

  return (
    <FormControl
      component="fieldset"
      sx={{
        width: "100%",
        // marginBottom: "10px",
        padding: "10px",
        paddingLeft: "20px",
        // paddingRight: "40px",
        // border: "1px  #ddd",
        border: `1px solid  ${theme.palette.divider}`,
        borderRadius: "3px",
        // flex: 1,
        height: "100%",
        minHeight: "200px",

        "& .MuiFormGroup-root": { height: "100%" },
      }}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>{children}</FormGroup>
    </FormControl>
  );
};
