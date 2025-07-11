import * as React from "react";

import { observer } from "mobx-react-lite";

import { Box } from "@mui/material";
import DialogWrapper from "@/components/common/dialog/dialogWrapper";

import { useTheme } from "@mui/material/styles";
import tutorial from "./store";
import { SvgIcon1 } from "./components/svg1";
import { SvgIcon2 } from "./components/svg2";

const Tutorial = observer(() => {
  const theme = useTheme();

  return (
    <DialogWrapper
      maxWidth={"xl"}
      fullWidth={true}
      onClose={() => tutorial.hide()}
      open={tutorial.visible}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          width: "100%",
          backgroundColor: "inherit",
          padding: "20px",
          // display: "inline-block",
          overflow: "scroll",
        }}
        onClick={() => tutorial.hide()}
      >
        <SvgIcon2 />
        <SvgIcon1 />
      </Box>
    </DialogWrapper>
  );
});

export default Tutorial;
