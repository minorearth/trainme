import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import { useTheme } from "@mui/material";

export const Panel = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  const theme = useTheme();

  return (
    <FormControl
      component="fieldset"
      sx={{
        width: "100%",
        padding: "10px",
        paddingLeft: "20px",
        border: `1px solid  ${theme.palette.divider}`,
        borderRadius: "3px",
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
