"use client";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import Animation from "@/components/common/animation/Animation";
import progress from "./progressStore";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

const Progress = observer(({}) => {
  const [close, setClose] = useState(false);
  useEffect(() => {
    progress.state.showProgress && setClose(true);
    progress.state.showProgress &&
      setTimeout(() => {
        setClose(false);
      }, progress.state.delay);
  }, [progress.state]);

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={close || progress.state.showProgress}
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
          backgroundColor: progress.state.background ? "black" : "transparent",
        }}
      ></Box>
      <Animation
        width={"700px"}
        height={"700px"}
        name={progress.state.animation}
      />
    </Backdrop>
  );
});

export default Progress;
