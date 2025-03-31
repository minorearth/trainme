"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/countdown/CountdownButton";
import { observer } from "mobx-react-lite";
import cowntdownbutton from "@/store/cowntdownbutton";
import Animation from "@/components/common/animation/Animation";
import stn from "@/globals/settings";
import { getCSP } from "@/db/localstorage";
import alertdialog from "@/store/dialog";

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
  }) => {
    const [executing, setExecuting] = useState(false);

    const {
      setRightCode,
      setForbiddenCode,
      nextTask,
      prevTaskNoPts,
      errorCountDownPressed,
      refreshInput,
      setOutput,
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
        <Button
          onClick={async (e) => {
            if (!pyodide || executing) return;
            setExecuting(true);
            // await runPythonCode(currTask.code, currTask.input);
            const { outputTxt } = await runPythonCode(
              currTask.code,
              currTask.input
            );

            setOutput(outputTxt);
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

        {!cowntdownbutton.state.visible && currTask.tasktype == "task" && (
          <Button
            onClick={async (e) => {
              if (!pyodide || executing) return;
              refreshInput();
              checkTask(currTask.code, tests[appState.taskId], tests.length);
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
              const CSP = getCSP();
              nextTask({ CSP });
            }}
            variant="outlined"
            disabled={appState.taskId >= tests.length - 1}
          >
            Продолжить
          </Button>
        )}
        {currTask.tasktype == "guide" && (
          <Button
            onClick={() => {
              actionsNAV.interruptExamMode();
            }}
            variant="outlined"
            disabled={appState.taskId >= tests.length - 1}
          >
            Выйти
          </Button>
        )}
        {cowntdownbutton.state.visible && (
          <CountdownButton
            onClick={() => {
              errorCountDownPressed();
              cowntdownbutton.hideButton();
            }}
            variant="outlined"
          />
        )}

        <Button
          onClick={() => {
            alertdialog.showDialog(
              "Завершить прохождение?",
              "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n2 монеты за каждую задачу вместо 10 монет",
              2,
              () => {
                const CSP = getCSP();
                actionsNAV.openCongratPage({ CSP });
              },
              () => {}
            );
          }}
          variant="outlined"
        >
          Завершить
        </Button>
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
