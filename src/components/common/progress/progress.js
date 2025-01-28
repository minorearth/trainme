"use client";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import Animation from "@/components/test/congrat/congratulation/congratAnimation";
import progress from "./progressStore";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

const Progress = observer(({}) => {
  const [close, setClose] = useState(false);
  useEffect(() => {
    setClose(true);
    setTimeout(() => {
      setClose(false);
    }, 3000);
  }, []);

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={close || progress.showProgress}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <Animation width={"700px"} height={"700px"} name={"python"} />
      </Box>
    </Backdrop>
  );
});

export default Progress;
