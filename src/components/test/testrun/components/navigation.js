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
import alertdialog from "@/components/common/dialog/store";

const Navigation = observer(
  ({
    actionsTsk,
    tests,
    actionsNAV,
    appState,
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
                currTask.code,
                currTask.input
              );

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
              refreshInput();
              checkTask(currTask.code, tests[appState.taskId], tests.length);
              editorRef.current.setValue("");
            }}
            disabled={!pyodide || executing}
            variant="outlined"
          >
            <Animation height={"30px"} width={"30px"} name={"coins"} />
            Проверить!
          </Button>
        )}
        {(appState.nodemode == "textbook" || stn.mode.DEV_MODE) && (
          <Button
            onClick={() => {
              editorRef.current.setValue("");
              prevTaskNoPts();
            }}
            variant="outlined"
            disabled={appState.taskId <= 0}
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
            disabled={appState.taskId >= tests.length - 1}
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
              setRightCode(appState.taskId);
            }}
            variant="outlined"
          >
            RC
          </Button>
        )}
        {stn.mode.DEV_MODE && (
          <Button
            onClick={() => {
              setForbiddenCode(appState.taskId);
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
