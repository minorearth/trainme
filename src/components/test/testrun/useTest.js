import { useState, useEffect, useRef } from "react";
import dialog from "@/store/dialog";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";
import splashCDStore from "@/components/common/splashAction/splashActionStore";
import { getSense } from "@/db/localstorage";

const useTest = ({
  appState,
  tests,
  actions,
  editorRef,
  setEditorDisabled,
}) => {
  const {
    changeState,
    persistStateNoEffect,
    setRunTestsPageRecap,
    runAccomplishAndShowCongratPage,
  } = actions;

  const [currTask, setCurrTask] = useState({});

  useEffect(() => {
    processSuspendedAfterError();
  }, []);

  useEffect(() => {
    appState.taskId != tests.length && setNextTask(appState.taskId);
  }, [appState]);

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  const nextTask = ({ pts }) => {
    changeState({
      taskId: appState.taskId + 1,
      pts,
    });
  };

  const nextTaskNoPts = () => {
    changeState({
      taskId: appState.taskId + 1,
    });
  };

  const prevTaskNoPts = () => {
    changeState({
      taskId: appState.taskId - 1,
    });
  };

  const doRecap = () => {
    const pts = getSense();
    changeState({ taskstage: "recap", pts });
    dialog.showDialog(
      "Повторение",
      "Попробуй еще раз решить ошибочные задачи",
      1,
      () => setRunTestsPageRecap(appState.recapTasks)
    );
  };

  const processSuspendedAfterError = async () => {
    switch (true) {
      case appState.taskId == tests.length - 1 &&
        appState.taskstage == "accomplished_suspended":
        runAccomplishAndShowCongratPage();
        return;
      case appState.taskId == tests.length - 1 &&
        appState.taskstage == "recap_suspended":
        doRecap();
        return;
      default:
        return "";
    }
  };

  const addErrorTaskToRecap = () => {
    const recapTasks = [...appState.recapTasks, appState.taskId];
    appState.recapTasks = recapTasks;
    persistStateNoEffect({
      recapTasks: recapTasks,
      taskId: appState.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    appState.taskstage = "accomplished_suspended";
    persistStateNoEffect({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    appState.taskstage = "recap_suspended";
    const recapTasks = [...appState.recapTasks, appState.taskId];
    appState.recapTasks = recapTasks;
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
        setCode(tests[appState.taskId].rightcode);
        setEditorDisabled(true);
        cowntdownbutton.showButton();
      }
    );
  };

  const ErrorCountDownPressed = async () => {
    editorRef.current.getModel().setValue("");
    setEditorDisabled(false);

    if (appState.taskId != tests.length - 1) {
      nextTaskNoPts();
      return;
    }
    if (
      appState.taskId == tests.length - 1 &&
      (appState.taskstage == "recap" ||
        appState.taskstage == "accomplished_suspended")
    ) {
      runAccomplishAndShowCongratPage();
    }
    if (
      appState.recapTasks.length > 0 &&
      (appState.taskstage == "WIP" || appState.taskstage == "recap_suspended")
    ) {
      doRecap();
    }
  };

  const getEarned = (
    error,
    taskstage,
    repeat,
    overflow,
    nodemode,
    courseid
  ) => {
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
    if (nodemode == "champ") {
      actions.updateChampPoins(pts, courseid);
    }
    persistStateNoEffect({ pts });
    return pts;
  };

  const ok = (action = () => {}) => {
    splashCDStore.setShow(false, "ok", 500, () => action());
  };

  const NextTaskOrCompleteTest = async ({ error, errorMsg }) => {
    editorRef.current.getModel().setValue("");
    const pts = getEarned(
      error,
      appState.taskstage,
      appState.repeat,
      appState.overflow,
      appState.nodemode,
      appState.chapter
    );
    switch (true) {
      case appState.taskId != tests.length - 1 && !error:
        ok();
        nextTask({ pts });
        return;
      case appState.taskId == tests.length - 1 && !error:
        if (appState.taskstage == "recap") {
          ok(runAccomplishAndShowCongratPage);
        }
        if (appState.recapTasks.length == 0 && appState.taskstage == "WIP") {
          ok(runAccomplishAndShowCongratPage);
        }
        if (appState.recapTasks.length != 0 && appState.taskstage == "WIP") {
          ok(doRecap);
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (
          appState.taskstage != "recap" &&
          appState.taskId != tests.length - 1
        ) {
          addErrorTaskToRecap();
        }

        if (
          appState.taskstage == "recap" &&
          appState.taskId != tests.length - 1
        ) {
          persistStateNoEffect({
            taskId: appState.taskId + 1,
          });
        }
        if (
          appState.taskstage != "recap" &&
          appState.taskId == tests.length - 1
        ) {
          errorOnLastWIPTask();
        }
        if (
          appState.taskstage == "recap" &&
          appState.taskId == tests.length - 1
        ) {
          errorOnLastRecapTask();
        }
        return;

      default:
        return "";
    }
  };

  const setCode = (code) => {
    setCurrTask((state) => ({
      ...state,
      code,
    }));
  };

  const formatForbidden = (forbidden, forbiddenRe, maxlines, tasktype) => {
    let res = "";
    res += `\n\n# Ограничения:\n# Максимальное количество строк кода: ${maxlines}`;

    if (tasktype != "task") {
      return "";
    }
    if (forbidden.length) {
      res += `# Запрещенные приёмы: ${forbidden.join(", ")}\n`;
    }

    return res;
  };

  const setNextTask = (id) => {
    const test = tests[id];
    setCurrTask({
      task: test.task,
      tasktype: test.tasktype,
      input: test.defaultinput.join("\n"),
      code:
        test.defaultcode +
        formatForbidden(
          test.restrictions.forbidden,
          test.restrictions.forbiddenRe,
          test.restrictions.maxlines,
          test.tasktype
        ),
      expectedOutput: test.defaultoutput.join("\n"),

      output: "",
      restrictErrors: "",
    });
  };
  const refreshInput = () => {
    const test = tests[appState.taskId];
    currTask.input = test.defaultinput.join("\n");
    refreshTask({ input: test.defaultinput.join("\n") });
  };

  const refreshTask = (data) => {
    setCurrTask((state) => ({ ...state, ...data }));
  };

  return {
    NextTaskOrCompleteTest,
    nextTaskNoPts,
    prevTaskNoPts,
    refreshInput,
    currTask,
    setOutput,
    getSense,
    ErrorCountDownPressed,
    setCode,
  };
};

export default useTest;
