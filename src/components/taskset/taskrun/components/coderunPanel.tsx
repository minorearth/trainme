"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/CountdownButton/CountdownButton";
import { observer } from "mobx-react-lite";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import S from "@/globals/settings";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/layers/store/task";
import { TSM, TT } from "tpconst/const";
import { L } from "tpconst/lang";

const CodeRunPanel = observer(() => {
  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "15px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      {!countdownbutton.state.visible && (
        <Button
          onClick={() => task.actions.runTask()}
          variant="outlined"
          disabled={task.executing}
        >
          {task.executing ? L.ru.buttons.TASK_EXECUTING : L.ru.buttons.RUNTASSK}
        </Button>
      )}

      {!countdownbutton.state.visible && task.currTask.tasktype == TT.task && (
        <Button
          onClick={(e) => {
            task.actions.checkTask();
          }}
          disabled={task.executing}
          variant="outlined"
        >
          <AnimationLottie
            style={{ height: "30px", width: "30px" }}
            name={"coins"}
          />
          {L.ru.buttons.CHECK_TASK}
        </Button>
      )}
      {(taskset.state.tasksetmode == TSM.textbook || S.mode.DEV_MODE) && (
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

      {countdownbutton.state.visible && (
        <CountdownButton
          onClick={() => {
            taskset.actions.errorCountDownPressed();
          }}
          // variant="outlined"
        />
      )}

      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.setRightCode_admin();
          }}
          variant="outlined"
        >
          RC
        </Button>
      )}
      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.setForbiddenCode_admin();
          }}
          variant="outlined"
        >
          FC
        </Button>
      )}
    </Box>
  );
});

export default CodeRunPanel;
