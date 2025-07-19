"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/CountdownButton/CountdownButton";
import { observer } from "mobx-react-lite";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import stn from "@/globals/settings";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/layers/store/task";
import { TSM, TT } from "@/T/typesBasic";

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
          {task.executing ? "Выполняется..." : "Выполнить"}
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
          Проверить!
        </Button>
      )}
      {(taskset.state.tasksetmode == TSM.textbook || stn.mode.DEV_MODE) && (
        <Button
          onClick={() => {
            taskset.prevTaskNoPts_admin();
          }}
          variant="outlined"
          disabled={taskset.prevdisabled}
        >
          Назад
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
          Продолжить
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

      {stn.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.setRightCode_admin();
          }}
          variant="outlined"
        >
          RC
        </Button>
      )}
      {stn.mode.DEV_MODE && (
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
