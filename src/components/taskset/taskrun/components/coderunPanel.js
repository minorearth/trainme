"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/countdown/CountdownButton/CountdownButton";
import { observer } from "mobx-react-lite";
import Animation from "@/components/common/lottieAnimation/Animation";
import stn from "@/globals/settings";

//stores
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import taskset from "@/components/taskset/store/taskset";
import task from "@/components/taskset/taskrun/store/task";

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

      {!countdownbutton.state.visible && task.currTask.tasktype == "task" && (
        <Button
          onClick={(e) => {
            task.actions.checkTask();
          }}
          disabled={task.executing}
          variant="outlined"
        >
          <Animation height={"30px"} width={"30px"} name={"coins"} />
          Проверить!
        </Button>
      )}
      {(taskset.state.nodemode == "textbook" || stn.mode.DEV_MODE) && (
        <Button
          onClick={() => {
            taskset.actions.prevTaskNoPts_admin();
          }}
          variant="outlined"
          disabled={task.currTaskId <= 0}
        >
          Назад
        </Button>
      )}
      {task.currTask.tasktype == "guide" && (
        <Button
          onClick={() => {
            taskset.actions.nextTask();
          }}
          variant="outlined"
          disabled={task.currTaskId >= taskset.tasknum - 1}
        >
          Продолжить
        </Button>
      )}

      {countdownbutton.state.visible && (
        <CountdownButton
          onClick={() => {
            taskset.actions.errorCountDownPressed();
          }}
          variant="outlined"
        />
      )}

      {stn.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.actions.setRightCode_admin(task.currTaskId);
          }}
          variant="outlined"
        >
          RC
        </Button>
      )}
      {stn.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.actions.setForbiddenCode_admin(task.currTaskId);
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
