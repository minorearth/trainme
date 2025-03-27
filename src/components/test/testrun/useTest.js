import { useState, useEffect, useRef } from "react";
import dialog from "@/store/dialog";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";
import splashCDStore from "@/components/common/splashAction/splashActionStore";
import { getSense, getSCP } from "@/db/localstorage";

const useTest = ({
  appState,
  tests,
  actions,
  editorRef,
  setEditorDisabled,
}) => {
  const {
    updateState,
    setState,
    updateLSState,
    setRecapTasks,
    openCongratPage,
    openRecapTasksPage,
  } = actions;

  const [currTask, setCurrTask] = useState({});

  useEffect(() => {
    // processSuspendedAfterError();
  }, []);

  useEffect(() => {
    appState.taskId != tests.length && openTask(appState.taskId);
  }, [appState.taskId]);

  const nextTaskOrCompleteTest = async ({ error, errorMsg, code }) => {
    editorRef.current.getModel().setValue("");
    const CSP = getSCP();

    const pts = getEarned(
      error,
      CSP.taskstage,
      CSP.repeat,
      CSP.overflow,
      CSP.nodemode,
      CSP.champid
    );
    setTaskLog({ error, code });
    switch (true) {
      case CSP.taskId != tests.length - 1 && !error:
        ok();
        nextTask({ pts });
        return;
      case CSP.taskId == tests.length - 1 && !error:
        if (CSP.taskstage == "recap") {
          ok(() => openCongratPage({ appStatePersisted: CSP }));
        }
        if (CSP.recapTasksIds.length == 0 && CSP.taskstage == "WIP") {
          ok(() => openCongratPage({ appStatePersisted: CSP }));
        }
        if (CSP.recapTasksIds.length != 0 && CSP.taskstage == "WIP") {
          ok(openRecapTasksPage(CSP.recapTasksIds, tests));
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (CSP.taskstage == "WIP" && CSP.taskId != tests.length - 1) {
          addErrorTaskToRecap();
        }

        if (CSP.taskstage == "recap" && CSP.taskId != tests.length - 1) {
          updateLSState({
            taskId: CSP.taskId + 1,
          });
        }
        if (CSP.taskstage == "WIP" && CSP.taskId == tests.length - 1) {
          errorOnLastWIPTask();
        }
        if (CSP.taskstage == "recap" && CSP.taskId == tests.length - 1) {
          errorOnLastRecapTask();
        }
        return;

      default:
        return "";
    }
  };

  const setTaskLog = ({ code, error }) => {
    const currStatePersisted = getSCP();
    console.log("iserror", error);
    const tasklog = !error ? { code } : { errorcode: code };
    Object.keys(currStatePersisted.tasklog).includes(currTask.taskuuid)
      ? updateLSState({
          tasklog: {
            ...currStatePersisted.tasklog,
            [currTask.taskuuid]: {
              ...currStatePersisted.tasklog[currTask.taskuuid],
              ...tasklog,
            },
          },
        })
      : updateLSState({
          tasklog: {
            ...currStatePersisted.tasklog,
            [currTask.taskuuid]: {
              ...tasklog,
            },
          },
        });
  };

  const nextTask = ({ pts }) => {
    const currStatePersisted = getSCP();

    setState({ ...currStatePersisted, taskId: appState.taskId + 1 });

    // updateState({
    //   taskId: appState.taskId + 1,
    //   pts,
    // });
  };

  const nextTaskNoPts = () => {
    const currStatePersisted = getSCP();
    setState({ ...currStatePersisted, taskId: appState.taskId + 1 });

    // updateState({
    //   taskId: appState.taskId + 1,
    // });
  };

  const prevTaskNoPts = () => {
    updateState({
      taskId: appState.taskId - 1,
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

  const errorCountDownPressed = async () => {
    console.log("sdds", tests);
    editorRef.current.getModel().setValue("");
    setEditorDisabled(false);

    if (appState.taskId != tests.length - 1) {
      nextTaskNoPts();
      return;
    }
    if (appState.taskstage == "accomplished_suspended") {
      openCongratPage({ appStatePersisted: appState });
    }
    if (appState.taskstage == "recap_suspended") {
      openRecapTasksPage(appState.recapTasksIds, tests);
    }
  };

  const setCode = (code) => {
    setCurrTask((state) => ({
      ...state,
      code,
    }));
  };

  const openTask = (id) => {
    console.log("id", id, tests);
    const test = tests[id];
    setCurrTask({
      task:
        test.task +
        formatForbidden(
          test.restrictions.forbidden,
          test.restrictions.forbiddenRe,
          test.restrictions.maxlines,
          test.tasktype
        ),
      tasktype: test.tasktype,
      input: test.defaultinput.join("\n"),
      code: test.defaultcode,
      expectedOutput: test.defaultoutput.join("\n"),
      taskuuid: test.taskuuid,

      output: "",
      restrictErrors: "",
    });
  };

  const setRightCode = (id) => {
    const test = tests[id];
    setCurrTask((state) => ({
      ...state,
      code: test.rightcode,
    }));
  };

  const setForbiddenCode = (id) => {
    const test = tests[id];
    setCurrTask((state) => ({
      ...state,
      code: test.forbiddencode,
    }));
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
    if (tasktype != "task") {
      return "";
    }
    res += `\n\n<b>Ограничения</b>:\nМаксимальное количество строк кода: ${maxlines}`;

    if (forbidden.length) {
      res += `\nЗапрещенные приёмы: ${forbidden.join(", ")}`;
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
    setRightCode,
    setForbiddenCode,
  };
};

export default useTest;
