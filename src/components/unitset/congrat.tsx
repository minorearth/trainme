"use client";
import { observer } from "mobx-react-lite";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";

//components
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import TextAnimated from "@/components/common/textAnimated/textAnimated";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import unitset from "@/components/unitset/layers/store/unitset";
import { ST } from "@/tpconst/src/const";

import { L } from "@/tpconst/src/lang";

const CongratPage = observer(() => {
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
      {unitset.state.success == ST.success && (
        <AnimationLottie
          style={{ height: "700px", width: "700px" }}
          name={"success"}
        />
      )}
      <Box sx={{}}></Box>
      {unitset.state.pts != 0 && (
        <TextAnimated text={`${L.ru.CG.COINS_EARNED}${unitset.state.pts} `} />
      )}

      <Button
        sx={{ mt: 3, mb: 3 }}
        variant="outlined"
        aria-label="repeat"
        onClick={() => {
          navigator.actions.closeCongratPage();
        }}
        endIcon={<ReplayIcon />}
      >
        {L.ru.CG.SAVE_AND_EXIT}
      </Button>
    </Box>
  );
});

export default CongratPage;
