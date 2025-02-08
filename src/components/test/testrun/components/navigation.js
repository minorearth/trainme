"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CountdownButton from "@/components/common/countdown/CountdownButton";
import { observer } from "mobx-react-lite";
import cowntdownbutton from "@/store/cowntdownbutton";
import Animation from "@/components/common/animation/Animation";

const Navigation = observer(
  ({
    tests,
    actions,
    nav,
    pyodide,
    checkTask,
    ErrorCountDownPressed,
    currTask,
    runPythonCode,
    nextTaskNoPts,
  }) => {
    const [executing, setExecuting] = useState(false);
    console.log("currTask.tasktype", currTask.tasktype);

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
            await runPythonCode(currTask.code, currTask.input);
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
              checkTask(currTask.code, tests[nav.taskId], tests.length);
            }}
            disabled={!pyodide || executing}
            variant="outlined"
          >
            <Animation height={"30px"} width={"30px"} name={"coins"} />
            Проверить!
          </Button>
        )}
        {currTask.tasktype == "guide" && (
          <Button
            onClick={() => {
              nextTaskNoPts();
            }}
            variant="outlined"
          >
            Продолжить
          </Button>
        )}
        {cowntdownbutton.state.visible && (
          <CountdownButton
            onClick={() => {
              ErrorCountDownPressed();
              cowntdownbutton.hideButton();
            }}
            variant="outlined"
          />
        )}
        <Button
          onClick={() => {
            actions.setTestInterrupted();
          }}
          variant="outlined"
        >
          Выйти
        </Button>
      </Box>
    );
  }
);

export default Navigation;
