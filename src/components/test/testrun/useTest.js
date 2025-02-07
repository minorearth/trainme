import { useState, useEffect, useRef } from "react";
import dialog from "@/store/dialog";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";
import splashCDStore from "@/components/common/splashAction/splashActionStore";
import { useTheme } from "@mui/material/styles";
import { loadStatePersisted } from "@/db/localstorage";

const useTest = ({
  nav,
  tests,
  changeState,
  changeStateNoEffect,
  setRunTestsPageRecap,
  runAccomplish,
  editorRef,
  setEditorDisabled,
}) => {
  const [currTask, setCurrTask] = useState({});

  useEffect(() => {
    processSuspendedAfterError();
  }, []);

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  const nextTask = ({ pts }) => {
    changeState({
      data: {
        taskId: nav.taskId + 1,
        pts,
      },
    });
  };

  const doRecap = ({ pts }) => {
    changeState({
      data: { taskstage: "recap", pts },
    });
    dialog.showDialog(
      "Повторение",
      "Попробуй еще раз решить ошибочные задачи",
      1,
      () => setRunTestsPageRecap(nav.recapTasks)
    );
  };

  const processSuspendedAfterError = async () => {
    switch (true) {
      case nav.taskId == tests.length - 1 &&
        nav.taskstage == "accomplished_suspended":
        runAccomplish(getSense());
        return;
      case nav.taskId == tests.length - 1 && nav.taskstage == "recap_suspended":
        doRecap({ pts: getSense() });
        return;
      default:
        return "";
    }
  };

  const addErrorTaskToRecap = () => {
    const recapTasks = [...nav.recapTasks, nav.taskId];
    nav.recapTasks = recapTasks;
    changeStateNoEffect({
      recapTasks: recapTasks,
      taskId: nav.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    nav.taskstage = "accomplished_suspended";
    changeStateNoEffect({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    nav.taskstage = "recap_suspended";
    const recapTasks = [...nav.recapTasks, nav.taskId];
    nav.recapTasks = recapTasks;
    changeStateNoEffect({
      taskstage: "recap_suspended",
      recapTasks,
    });
  };

  const getSense = () => {
    const { pts } = loadStatePersisted();
    if (!pts) {
      return 0;
    } else {
      return pts;
    }
  };

  const showRightCodeAfterError = ({ errorMsg }) => {
    alertdialog.showDialog(
      local.ru.msg.alert.PSW_TEST_ERROR,
      errorMsg,
      1,

      () => {
        setCode(tests[nav.taskId].rightcode);
        setEditorDisabled(true);
        cowntdownbutton.showButton();
      }
    );
  };

  const ErrorCountDownPressed = async () => {
    editorRef.current.getModel().setValue("");
    setEditorDisabled(false);

    if (nav.taskId != tests.length - 1) {
      nextTask({ pts: getSense() });
      return;
    }
    if (
      nav.taskId == tests.length - 1 &&
      (nav.taskstage == "recap" || nav.taskstage == "accomplished_suspended")
    ) {
      runAccomplish(getSense());
    }
    if (
      nav.recapTasks.length > 0 &&
      (nav.taskstage == "WIP" || nav.taskstage == "recap_suspended")
    ) {
      doRecap({ pts: getSense() });
    }
  };

  const NextTaskOrCompleteTest = async ({ error, errorMsg, earned = 0 }) => {
    editorRef.current.getModel().setValue("");
    switch (true) {
      case nav.taskId != tests.length - 1 && !error:
        splashCDStore.setShow(false, "ok", 500, () => {});
        nextTask({ pts: getSense() + earned });
        return;
      case nav.taskId == tests.length - 1 && !error:
        if (nav.taskstage == "recap") {
          splashCDStore.setShow(false, "ok", 500, () =>
            runAccomplish(getSense())
          );
        }
        if (nav.recapTasks.length == 0 && nav.taskstage == "WIP") {
          splashCDStore.setShow(false, "ok", 500, () =>
            runAccomplish(getSense() + earned)
          );
        }
        if (nav.recapTasks.length != 0 && nav.taskstage == "WIP") {
          splashCDStore.setShow(false, "ok", 500, () =>
            doRecap({ pts: getSense() + earned })
          );
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (nav.taskstage != "recap" && nav.taskId != tests.length - 1) {
          addErrorTaskToRecap();
        }

        if (nav.taskstage == "recap" && nav.taskId != tests.length - 1) {
          changeStateNoEffect({
            taskId: nav.taskId + 1,
          });
        }
        if (nav.taskstage != "recap" && nav.taskId == tests.length - 1) {
          errorOnLastWIPTask();
        }
        if (nav.taskstage == "recap" && nav.taskId == tests.length - 1) {
          errorOnLastRecapTask();
        }
        return;

      default:
        return "";
    }
  };

  useEffect(() => {
    nav.taskId != tests.length && setNextTask(nav.taskId);
  }, [nav]);

  const setCode = (code) => {
    setCurrTask((state) => ({
      ...state,
      code,
    }));
  };

  const setNextTask = (id) => {
    const test = tests[id];
    setCurrTask({
      task: test.task,
      input: test.defaultinput.join("\n"),
      code: test.defaultcode,
      expectedOutput: test.defaultoutput.join("\n"),
      output: "",
      restrictErrors: "",
    });
  };

  return {
    NextTaskOrCompleteTest,
    currTask,
    setOutput,
    getSense,
    ErrorCountDownPressed,
    setCode,
  };
};

export default useTest;
