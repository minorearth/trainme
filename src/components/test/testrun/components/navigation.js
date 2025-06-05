"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/countdown/CountdownButton/CountdownButton";
import { observer } from "mobx-react-lite";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import Animation from "@/components/common/lottieAnimation/Animation";
import stn from "@/globals/settings";
import { getCSP } from "@/db/localstorage";
import AS from "@/store/appstate";

const Navigation = observer(
  ({
    actionsTsk,
    tasks,
    pyodide,
    checkTask,
    currTask,
    runPythonCode,
    editorRef,
  }) => {
    const [executing, setExecuting] = useState(false);

    const {
      setRightCode,
      setForbiddenCode,
      nextTask,
      prevTaskNoPts,
      errorCountDownPressed,
      refreshInput,
      updateCurrTask,
    } = actionsTsk;

    const createfile = (data, filename) => {
      return `f=open("${filename}", 'w')\nf.write("${data}")\nf.close()\n`;
    };
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
            onClick={async (e) => {
              if (!pyodide || executing) return;
              setExecuting(true);
              const { outputTxt } = await runPythonCode(
                currTask.filedata + currTask.code,
                currTask.input
              );
              console.log("check10");

              updateCurrTask({ output: outputTxt });
              setExecuting(false);
            }}
            variant="outlined"
            disabled={!pyodide || executing}
          >
            {!pyodide
              ? "Загружается..."
              : executing
              ? "Выполняется..."
              : "Выполнить"}
          </Button>
        )}

        {!countdownbutton.state.visible && currTask.tasktype == "task" && (
          <Button
            onClick={async (e) => {
              if (!pyodide || executing) return;
              //TODO: Не понимаю зачем делал это, закомментировал
              // refreshInput();
              await checkTask(currTask.code, tasks[AS.as.taskId]);
              // editorRef.current.setValue("");
            }}
            disabled={!pyodide || executing}
            variant="outlined"
          >
            <Animation height={"30px"} width={"30px"} name={"coins"} />
            Проверить!
          </Button>
        )}
        {(AS.as.nodemode == "textbook" || stn.mode.DEV_MODE) && (
          <Button
            onClick={() => {
              editorRef.current.setValue("");
              prevTaskNoPts();
            }}
            variant="outlined"
            disabled={AS.as.taskId <= 0}
          >
            Назад
          </Button>
        )}
        {currTask.tasktype == "guide" && (
          <Button
            onClick={() => {
              editorRef.current.setValue("");
              const CSP = getCSP();
              nextTask({ CSP });
            }}
            variant="outlined"
            disabled={AS.as.taskId >= tasks.length - 1}
          >
            Продолжить
          </Button>
        )}

        {countdownbutton.state.visible && (
          <CountdownButton
            onClick={() => {
              editorRef.current.setValue("");
              errorCountDownPressed();
              countdownbutton.hideButton();
            }}
            variant="outlined"
          />
        )}

        {stn.mode.DEV_MODE && (
          <Button
            onClick={() => {
              setRightCode(AS.as.taskId);
            }}
            variant="outlined"
          >
            RC
          </Button>
        )}
        {stn.mode.DEV_MODE && (
          <Button
            onClick={() => {
              setForbiddenCode(AS.as.taskId);
            }}
            variant="outlined"
          >
            FC
          </Button>
        )}
      </Box>
    );
  }
);

export default Navigation;
