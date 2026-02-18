"use client";
import Box from "@mui/material/Box";
import LinearProgressWithLabel from "@/components/unitset/unitrun/components/topPanel/LinearProgress";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import Typography from "@mui/material/Typography";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import SendIcon from "@mui/icons-material/Send";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

import { observer } from "mobx-react-lite";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import pyodide from "@/components/pyodide/pyodide";

import countdownbutton from "@/components/common/CountdownButton/store";

import unitset from "@/components/unitset/layers/store/unitset";
import { L } from "@/tpconst/src/lang";
import { TSM, TT } from "@/tpconst/src";
import CountdownButton from "@/components/common/CountdownButton/CountdownButton";
import { IoArrowForwardCircle } from "react-icons/io5";
import { IoArrowBackCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";

const HEIGHT = "80px";
const TopPG = observer(() => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "50px",
      }}
    >
      <IconButtonNoRipple>
        <Tooltip title={L.ru.TT.INTERRUPT_CHAPTER}>
          <HomeIcon
            sx={{ fontSize: "40px", marginRight: "15px" }}
            onClick={() => {
              // navigator.actions.gotoCoursespage(router);
              navigator.actions.openAllCoursePage();
            }}
          />
        </Tooltip>
      </IconButtonNoRipple>
      <DLSwitch sx={{}} />
    </Box>
  );
});

export default TopPG;
