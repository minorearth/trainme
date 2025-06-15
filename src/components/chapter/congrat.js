"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Animation from "@/components/common/lottieAnimation/Animation";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";
import TextAnimated from "@/components/common/textAnimated/textAnimated";
import { useEffect, useState } from "react";
import navigator from "@/components/Navigator/store/navigator";
import chapter from "./store/chapter";
import { observer } from "mobx-react-lite";

const CongratPage = observer(() => {
  const [pts, setPts] = useState(10);
  const [isSuccess, setIsSuccess] = useState();

  useEffect(() => {
    // setPts(chapter.state.pts);
    // setIsSuccess(chapter.state.success);
  }, []);

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
      {chapter.state.success && (
        <Animation width={"700px"} height={"700px"} name={"success"} />
      )}
      <Box sx={{}}></Box>
      {chapter.state.pts != 0 && (
        <TextAnimated text={`Заработанные монеты: ${chapter.state.pts} `} />
      )}

      <Button
        sx={{ mt: 3, mb: 3 }}
        variant="outlined"
        aria-label="repeat"
        onClick={() => {
          navigator.navMethods.closeCongratPage(chapter.state.success);
        }}
        endIcon={<ReplayIcon />}
      >
        {"Сохранить и завершить"}
      </Button>
    </Box>
  );
});

export default CongratPage;
