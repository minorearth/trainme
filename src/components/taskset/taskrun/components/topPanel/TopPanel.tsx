"use client";
import Box from "@mui/material/Box";
import LinearProgressWithLabel from "@/components/taskset/taskrun/components/topPanel/LinearProgress";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import Typography from "@mui/material/Typography";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";

import { observer } from "mobx-react-lite";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import task from "@/components/taskset/taskrun/layers/store/task";

import countdownbutton from "@/components/common/CountdownButton/store";

import taskset from "@/components/taskset/layers/store/taskset";
import { L } from "@/tpconst/src/lang";
import { TSM, TT } from "@/tpconst/src";
import CountdownButton from "@/components/common/CountdownButton/CountdownButton";

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
            value={((taskset.state.currTaskId + 1) / taskset.tasknum) * 100}
            label={`${taskset.state.currTaskId + 1}\\${taskset.tasknum}`}
          />
          {taskset.state.tasksetmode == TSM.textbook && (
            <Button
              onClick={() => {
                taskset.prevTaskNoPts_admin();
              }}
              variant="outlined"
              disabled={taskset.prevdisabled}
            >
              {L.ru.buttons.BACK_CHAMP}
            </Button>
          )}
          {!countdownbutton.state.visible &&
            task.currTask.tasktype == TT.task && (
              <Button
                onClick={(e) => {
                  task.actions.checkTaskAction();
                }}
                disabled={task.monaco?.executing}
                variant="outlined"
              >
                {/* <AnimationLottie
                  style={{ height: "30px", width: "30px" }}
                  name={"coins"}
                /> */}
                {L.ru.buttons.CHECK_TASK}
              </Button>
            )}
          {countdownbutton.state.visible && (
            <CountdownButton
              onClick={() => {
                taskset.actions.errorCountDownPressed();
              }}
              // variant="outlined"
            />
          )}
          {task.currTask.tasktype == TT.guide && (
            <Button
              onClick={() => {
                taskset.nextTask();
              }}
              variant="outlined"
              disabled={taskset.nextdisabled}
            >
              {L.ru.buttons.PROCEED}
            </Button>
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
            {taskset.state.pts}
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
                  navigator.actions.interruptTaskSet();
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
