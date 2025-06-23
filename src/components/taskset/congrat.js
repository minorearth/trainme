"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Animation from "@/components/common/lottieAnimation/Animation";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";
import TextAnimated from "@/components/common/textAnimated/textAnimated";
import { useEffect, useState } from "react";
import navigator from "@/components/Navigator/layers/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";

import { observer } from "mobx-react-lite";

const CongratPage = observer(() => {
  const [pts, setPts] = useState(10);
  const [isSuccess, setIsSuccess] = useState();

  useEffect(() => {}, []);

  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: window.innerHeight,
        alignItems: "center",
        justifyContent: "center",
        transition: "padding 5s",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {taskset.state.success && (
        <Animation width={"700px"} height={"700px"} name={"success"} />
      )}
      <Box sx={{}}></Box>
      {taskset.state.pts != 0 && (
        <TextAnimated text={`Заработанные монеты: ${taskset.state.pts} `} />
      )}

      <Button
        sx={{ mt: 3, mb: 3 }}
        variant="outlined"
        aria-label="repeat"
        onClick={() => {
          navigator.actions.closeCongratPage(taskset.state.success);
        }}
        endIcon={<ReplayIcon />}
      >
        {"Сохранить и завершить"}
      </Button>
    </Box>
  );
});

export default CongratPage;
