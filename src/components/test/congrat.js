"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Animation from "@/components/common/lottieAnimation/Animation";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";
import TextAnimated from "@/components/common/textAnimated/textAnimated";
import { useEffect, useState } from "react";
import { getCSP } from "@/db/localstorage";

let pts;
const CongratPage = ({ actionsNAV }) => {
  const [pts, setPts] = useState(10);
  const [isSuccess, setIsSuccess] = useState();

  useEffect(() => {
    const { pts, success } = getCSP();
    setPts(pts);
    setIsSuccess(success);
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
      {isSuccess && (
        <Animation width={"700px"} height={"700px"} name={"success"} />
      )}
      <Box sx={{}}></Box>
      {pts != 0 && <TextAnimated text={`Заработанные монеты: ${pts} `} />}

      <Button
        sx={{ mt: 3, mb: 3 }}
        variant="outlined"
        aria-label="repeat"
        onClick={async () => {
          const { success } = getCSP();
          await actionsNAV.saveProgress(success);
        }}
        endIcon={<ReplayIcon />}
      >
        {"Сохранить и завершить"}
      </Button>
    </Box>
  );
};

export default CongratPage;
