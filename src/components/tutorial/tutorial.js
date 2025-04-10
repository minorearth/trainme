import * as React from "react";

import { observer } from "mobx-react-lite";

import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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
          //   width: "fit-content",
          display: "inline-block",
          // whiteSpace: "pre-line",
          overflow: "scroll",
        }}
        onClick={() => tutorial.hide()}
      >
        {/* <Typography variant="h5" sx={{ textAlign: "center" }}>
          Приветствуем в туториале!
        </Typography>
        <Typography sx={{}}>
          Расскажем об основных фичах приложения. Курс состоит из тем.Для
          успешного решения задач необходимо изучить теорию. За решения задач
          начисляются монеты, которые используются для открытия некоторых тем.
        </Typography> */}
        <SvgIcon2 />
        <SvgIcon1 />
      </Box>
    </DialogWrapper>
  );
});

export default Tutorial;
