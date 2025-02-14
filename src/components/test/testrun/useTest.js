import { useState, useEffect, useRef } from "react";
import dialog from "@/store/dialog";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";
import splashCDStore from "@/components/common/splashAction/splashActionStore";
import { getSense } from "@/db/localstorage";

const useTest = ({ nav, tests, actions, editorRef, setEditorDisabled }) => {
  const {
    changeState,
    persistStateNoEffect,
    setRunTestsPageRecap,
    runAccomplish,
  } = actions;

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

  const nextTaskNoPts = () => {
    changeState({
      data: {
        taskId: nav.taskId + 1,
      },
    });
  };

  const prevTaskNoPts = () => {
    changeState({
      data: {
        taskId: nav.taskId - 1,
      },
    });
  };

  const doRecap = () => {
    const pts = getSense();
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
        runAccomplish();
        return;
      case nav.taskId == tests.length - 1 && nav.taskstage == "recap_suspended":
        doRecap();
        return;
      default:
        return "";
    }
  };

  const addErrorTaskToRecap = () => {
    const recapTasks = [...nav.recapTasks, nav.taskId];
    nav.recapTasks = recapTasks;
    persistStateNoEffect({
      recapTasks: recapTasks,
      taskId: nav.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    nav.taskstage = "accomplished_suspended";
    persistStateNoEffect({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    nav.taskstage = "recap_suspended";
    const recapTasks = [...nav.recapTasks, nav.taskId];
    nav.recapTasks = recapTasks;
    persistStateNoEffect({
      taskstage: "recap_suspended",
      recapTasks,
    });
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
      nextTaskNoPts();
      return;
    }
    if (
      nav.taskId == tests.length - 1 &&
      (nav.taskstage == "recap" || nav.taskstage == "accomplished_suspended")
    ) {
      runAccomplish();
    }
    if (
      nav.recapTasks.length > 0 &&
      (nav.taskstage == "WIP" || nav.taskstage == "recap_suspended")
    ) {
      doRecap();
    }
  };

  const getEarned = (error, taskstage, repeat, overflow) => {
    let pts = getSense();
    if (overflow) {
      return pts;
    }
    if (!error && taskstage == "WIP" && !repeat) {
      pts += 10;
    }
    if (!error && taskstage == "recap" && !repeat) {
      pts += 2;
    }
    if (!error && taskstage == "WIP" && repeat) {
      pts += 2;
    }
    if (!error && taskstage == "recap" && repeat) {
      pts += 1;
    }
    persistStateNoEffect({ pts });
    return pts;
  };

  const ok = (action = () => {}) => {
    splashCDStore.setShow(false, "ok", 500, () => action());
  };

  const NextTaskOrCompleteTest = async ({ error, errorMsg }) => {
    editorRef.current.getModel().setValue("");
    const pts = getEarned(error, nav.taskstage, nav.repeat, nav.overflow);
    switch (true) {
      case nav.taskId != tests.length - 1 && !error:
        ok();
        nextTask({ pts });
        return;
      case nav.taskId == tests.length - 1 && !error:
        if (nav.taskstage == "recap") {
          ok(runAccomplish);
        }
        if (nav.recapTasks.length == 0 && nav.taskstage == "WIP") {
          ok(runAccomplish);
        }
        if (nav.recapTasks.length != 0 && nav.taskstage == "WIP") {
          ok(doRecap);
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (nav.taskstage != "recap" && nav.taskId != tests.length - 1) {
          addErrorTaskToRecap();
        }

        if (nav.taskstage == "recap" && nav.taskId != tests.length - 1) {
          persistStateNoEffect({
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
    console.log(test);
    setCurrTask({
      task: test.task,
      tasktype: test.tasktype,
      input: test.defaultinput.join("\n"),
      code: test.defaultcode,
      expectedOutput: test.defaultoutput.join("\n"),
      output: "",
      restrictErrors: "",
    });
  };

  return {
    NextTaskOrCompleteTest,
    nextTaskNoPts,
    prevTaskNoPts,
    currTask,
    setOutput,
    getSense,
    ErrorCountDownPressed,
    setCode,
  };
};

export default useTest;
