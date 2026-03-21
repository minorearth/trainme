import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import { Box, useTheme } from "@mui/material";

export const Panel = ({
  children,
  label,
  sx = {},
}: {
  children: React.ReactNode;
  label: string;
  sx?: any;
}) => {
  const theme = useTheme();

  return (
    <FormControl
      component="fieldset"
      sx={{
        // width: "100%",
        padding: "10px",
        paddingLeft: "20px",
        paddingRight: "10px",
        border: `1px solid  ${theme.palette.divider}`,
        borderRadius: "3px",
        display: "flex",
        flex: "1 1 0px",
        minWidth: 0,
        "& .MuiFormGroup-root": {
          flexGrow: 1,
          display: "flex",
          minHeight: 0,
          minWidth: 0,
        },
        ...sx,
      }}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>{children}</FormGroup>
    </FormControl>
  );
};
