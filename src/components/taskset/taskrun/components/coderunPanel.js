"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/countdown/CountdownButton/CountdownButton";
import { observer } from "mobx-react-lite";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import Animation from "@/components/common/lottieAnimation/Animation";
import stn from "@/globals/settings";
import taskset from "@/components/taskset/store/taskset";
import task from "@/components/taskset/taskrun/store/task";
import navigator from "@/components/Navigator/store/navigator";

const CodeRunPanel = observer(({ checkTask, runTask }) => {
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
          onClick={() => runTask()}
          variant="outlined"
          disabled={task.executing}
        >
          {task.executing ? "Выполняется..." : "Выполнить"}
        </Button>
      )}

      {!countdownbutton.state.visible && task.currTask.tasktype == "task" && (
        <Button
          onClick={async (e) => {
            if (task.executing) return;
            //TODO: Не понимаю зачем делал это, закомментировал. Все правильно,  чтобы сбросить инпут перед провверкой
            // refreshInput();
            await checkTask();
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
            task.editorRef.current.setValue("");
            taskset.actions.prevTaskNoPts();
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
            task.editorRef.current.setValue("");
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
            task.editorRef.current.setValue("");
            taskset.actions.errorCountDownPressed();
            countdownbutton.hideButton();
          }}
          variant="outlined"
        />
      )}

      {stn.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.actions.setRightCode(task.currTaskId);
          }}
          variant="outlined"
        >
          RC
        </Button>
      )}
      {stn.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.actions.setForbiddenCode(task.currTaskId);
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
