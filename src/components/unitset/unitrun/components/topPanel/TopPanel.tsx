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

import countdownbutton from "@/components/common/CountdownButton/store";

import unitset from "@/components/unitset/layers/store/unitset";
import { L } from "@/tpconst/src/lang";
import { TSM, TT } from "@/tpconst/src";
import CountdownButton from "@/components/common/CountdownButton/CountdownButton";
import { IoArrowForwardCircle } from "react-icons/io5";
import { IoArrowBackCircle } from "react-icons/io5";

const HEIGHT = "80px";
const TopPanel = observer(() => {
  return (
    <Grid
      container
      spacing={0}
      columns={{ xs: 1, sm: 6, md: 10 }}
      sx={{ marginTop: "10px", flexGrow: 1 }}
    >
      <Grid size={{ xs: 1, sm: 3, md: 7 }} order={{ xs: 2, sm: 1, md: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimationLottie
            style={{ height: HEIGHT, width: HEIGHT }}
            name={"sheep"}
          />
          <LinearProgressWithLabel
            value={((unitset.state.currUnitId + 1) / unitset.unitsnum) * 100}
            label={`${unitset.state.currUnitId + 1}\\${unitset.unitsnum}`}
          />
          {unitset.state.unitsetmode == TSM.textbook && (
            <IconButtonNoRipple disabled={unitset.prevdisabled}>
              <Tooltip title={L.ru.TT.CODE_RUN}>
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  <IoArrowBackCircle
                    style={{ fontSize: "40px" }}
                    onClick={() => {
                      unitset.prevUnitNoPts_admin();
                    }}
                  />
                </span>
              </Tooltip>
            </IconButtonNoRipple>

            // <Button
            //   onClick={() => {
            //     unitset.prevUnitNoPts_admin();
            //   }}
            //   variant="outlined"
            //   disabled={unitset.prevdisabled}
            // >
            //   {L.ru.buttons.BACK_CHAMP}
            // </Button>
          )}
          {!countdownbutton.state.visible &&
            unit.currUnit.unittype == TT.task && (
              // <Button
              //   onClick={(e) => {
              //     task.actions.checkTaskAction();
              //   }}
              //   disabled={task.editors[0].executing}
              //   variant="outlined"
              // >
              //   {L.ru.buttons.CHECK_TASK}
              // </Button>
              <IconButtonNoRipple disabled={false}>
                <Tooltip title={L.ru.TT.CODE_RUN}>
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <FaCheckCircle
                      style={{ fontSize: "35px" }}
                      onClick={(e) => {
                        unit.actions.checkTaskAction();
                      }}
                    />
                  </span>
                </Tooltip>
              </IconButtonNoRipple>
            )}
          {countdownbutton.state.visible && (
            <CountdownButton
              onClick={() => {
                unitset.actions.errorCountDownPressed();
              }}
              // variant="outlined"
            />
          )}
          {unit.currUnit.unittype == TT.guide && (
            <IconButtonNoRipple disabled={unitset.nextdisabled}>
              <Tooltip title={L.ru.TT.CODE_RUN}>
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  <IoArrowForwardCircle
                    style={{ fontSize: "40px" }}
                    // sx={{
                    //   fontSize: "40px",
                    //   // marginLeft: "25px",
                    //   marginRight: "15px",
                    // }}
                    onClick={() => {
                      unitset.nextUnit();
                    }}
                  />
                </span>
              </Tooltip>
            </IconButtonNoRipple>
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 1, sm: 3, md: 3 }} order={{ xs: 1, sm: 2, md: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: HEIGHT,
          }}
        >
          <AnimationLottie
            style={{ height: "50px", width: "50px" }}
            name={"coins"}
          />
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: 22 }}
          >
            {unitset.state.pts}
          </Typography>
          <IconButtonNoRipple>
            <Tooltip title={L.ru.TT.HOWTO_GUIDE}>
              <LightbulbIcon
                sx={{
                  fontSize: "40px",
                  marginLeft: "25px",
                  marginRight: "15px",
                }}
                onClick={() => {
                  navigator.actions.openTutorial();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>
          <IconButtonNoRipple>
            <Tooltip title={L.ru.TT.INTERRUPT_CHAPTER}>
              <HomeIcon
                sx={{ fontSize: "40px", marginRight: "15px" }}
                onClick={() => {
                  navigator.actions.interruptUnitSet();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>
          <DLSwitch sx={{}} />
        </Box>
      </Grid>
    </Grid>
  );
});

export default TopPanel;
