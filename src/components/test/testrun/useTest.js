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
    updateLSState,
    setRecapTasks,
    openCongratPage,
    doRecap,
  } = actions;

  const [currTask, setCurrTask] = useState({});

  useEffect(() => {
    // processSuspendedAfterError();
  }, []);

  useEffect(() => {
    appState.taskId != tests.length && setNextTask(appState.taskId);
  }, [appState.taskId]);

  const nextTaskOrCompleteTest = async ({ error, errorMsg }) => {
    editorRef.current.getModel().setValue("");
    const pts = getEarned(
      error,
      appState.taskstage,
      appState.repeat,
      appState.overflow,
      appState.nodemode,
      appState.champid
    );
    switch (true) {
      case appState.taskId != tests.length - 1 && !error:
        ok();
        nextTask({ pts });
        return;
      case appState.taskId == tests.length - 1 && !error:
        if (appState.taskstage == "recap") {
          ok(openCongratPage);
        }
        if (appState.recapTasksIds.length == 0 && appState.taskstage == "WIP") {
          ok(openCongratPage);
        }
        if (appState.recapTasksIds.length != 0 && appState.taskstage == "WIP") {
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
          updateLSState({
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

  const nextTask = ({ pts }) => {
    changeState({
      taskId: appState.taskId + 1,
      pts,
    });
  };

  const addErrorTaskToRecap = () => {
    const recapTasksIds = [...appState.recapTasksIds, appState.taskId];
    appState.recapTasksIds = recapTasksIds;
    updateLSState({
      recapTasksIds,
      taskId: appState.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    appState.taskstage = "accomplished_suspended";
    updateLSState({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    appState.taskstage = "recap_suspended";
    const recapTasksIds = [...appState.recapTasksIds, appState.taskId];
    appState.recapTasksIds = recapTasksIds;
    updateLSState({
      taskstage: "recap_suspended",
      recapTasksIds,
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

  const ok = (action = () => {}) => {
    splashCDStore.setShow(false, "ok", 500, () => action());
  };

  const getEarned = (error, taskstage, repeat, overflow, nodemode, champid) => {
    let pts = getSense();
    if (overflow) {
      return pts;
    }
    if (!error) {
      if (taskstage == "WIP" && !repeat && nodemode != "renewal") {
        pts += 10;
      }
      if (taskstage == "WIP" && !repeat && nodemode == "renewal") {
        pts += 2;
      }
      if (taskstage == "WIP" && repeat && nodemode != "renewal") {
        pts += 2;
      }
      if (taskstage == "WIP" && repeat && nodemode == "renewal") {
        pts += 1;
      }

      if (taskstage == "recap" && !repeat && nodemode != "renewal") {
        pts += 2;
      }

      if (taskstage == "recap" && !repeat && nodemode == "renewal") {
        pts += 1;
      }

      if (taskstage == "recap" && repeat) {
        pts += 1;
      }
      if (nodemode == "champ") {
        actions.updateChampPoins(pts, champid);
      }
    }
    updateLSState({ pts });
    return pts;
  };

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
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

  const processSuspendedAfterError = async () => {
    switch (true) {
      case appState.taskId == tests.length - 1 &&
        appState.taskstage == "accomplished_suspended":
        openCongratPage();
        return;
      case appState.taskId == tests.length - 1 &&
        appState.taskstage == "recap_suspended":
        doRecap(appState.recapTasksIds, tests);
        return;
      default:
        return "";
    }
  };

  const errorCountDownPressed = async () => {
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
      openCongratPage();
    }
    if (
      //TODO:
      appState.recapTasksIds.length > 0 &&
      (appState.taskstage == "WIP" || appState.taskstage == "recap_suspended")
    ) {
      doRecap(appState.recapTasksIds, tests);
    }
  };

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
    const input = test.defaultinput.join("\n");
    currTask.input = input;
    setCurrTask((state) => ({ ...state, input }));
  };

  //UTILIIES
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

  return {
    nextTaskOrCompleteTest,
    nextTaskNoPts,
    prevTaskNoPts,
    refreshInput,
    currTask,
    setOutput,
    getSense,
    errorCountDownPressed,
    setCode,
  };
};

export default useTest;
