import { useState, useEffect, useRef } from "react";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";
import splashCDStore from "@/components/common/splashAction/splashActionStore";
import { getSense, getCSP, setCSP, updateSCP } from "@/db/localstorage";

const useTest = ({
  appState,
  tests,
  actionsNAV,
  editorRef,
  setEditorDisabled,
}) => {
  const { setappState, openCongratPage, openRecapTasksPage, setStateAndCSP } =
    actionsNAV;

  const [currTask, setCurrTask] = useState({});

  useEffect(() => {
    appState.taskId != tests.length && openTask(appState.taskId);
  }, [appState.taskId]);

  const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
    editorRef.current.getModel().setValue("");
    setTaskLog({ error, code });
    const CSP = getCSP();
    setEarned(
      error,
      CSP.taskstage,
      CSP.repeat,
      CSP.overflow,
      CSP.nodemode,
      CSP.champid
    );
    switch (true) {
      case CSP.taskId != tests.length - 1 && !error:
        ok();
        nextTask({ CSP });
        return;
      case CSP.taskId == tests.length - 1 && !error:
        if (CSP.taskstage == "recap") {
          ok(() => openCongratPage({ CSP }));
        }
        if (CSP.recapTasksIds.length == 0 && CSP.taskstage == "WIP") {
          ok(() => openCongratPage({ CSP }));
        }
        if (CSP.recapTasksIds.length != 0 && CSP.taskstage == "WIP") {
          ok(() => openRecapTasksPage(CSP.recapTasksIds, tests));
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (CSP.taskstage == "WIP" && CSP.taskId != tests.length - 1) {
          addErrorTaskToRecap({ CSP });
        }

        if (CSP.taskstage == "recap" && CSP.taskId != tests.length - 1) {
          updateSCP({
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
    const CSP = getCSP();
    const tasklog = !error ? { code } : { errorcode: code };
    Object.keys(CSP.tasklog).includes(currTask.taskuuid)
      ? updateSCP({
          tasklog: {
            ...CSP.tasklog,
            [currTask.taskuuid]: {
              ...CSP.tasklog[currTask.taskuuid],
              ...tasklog,
            },
          },
        })
      : updateSCP({
          tasklog: {
            ...CSP.tasklog,
            [currTask.taskuuid]: {
              ...tasklog,
            },
          },
        });
  };

  const nextTask = ({ CSP }) => {
    setStateAndCSP({ ...CSP, taskId: CSP.taskId + 1 });
  };

  // const nextTask = ({ CSP }) => {
  //   setStateAndCSP({ ...CSP, taskId: CSP.taskId + 1 });
  // };

  const prevTaskNoPts = () => {
    const CSP = getCSP();
    setStateAndCSP({ ...CSP, taskId: CSP.taskId - 1 });
  };

  const addErrorTaskToRecap = ({ CSP }) => {
    const recapTasksIds = [...CSP.recapTasksIds, appState.taskId];
    // appState.recapTasksIds = recapTasksIds;
    setCSP({
      ...CSP,
      recapTasksIds,
      taskId: appState.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    appState.taskstage = "accomplished_suspended";
    updateSCP({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    appState.taskstage = "recap_suspended";
    const recapTasksIds = [...appState.recapTasksIds, appState.taskId];
    appState.recapTasksIds = recapTasksIds;
    updateSCP({
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

  const setEarned = (error, taskstage, repeat, overflow, nodemode, champid) => {
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
        actionsNAV.updateChampPoins(pts, champid);
      }
    }
    updateSCP({ pts });
    return pts;
  };

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  const errorCountDownPressed = async () => {
    editorRef.current.getModel().setValue("");
    setEditorDisabled(false);
    const CSP = getCSP();

    if (CSP.taskId != tests.length - 1) {
      setappState({ ...CSP });
      // nextTask({ CSP });
      return;
    }
    if (CSP.taskstage == "accomplished_suspended") {
      openCongratPage({ CSP });
    }
    if (CSP.taskstage == "recap_suspended") {
      openRecapTasksPage(CSP.recapTasksIds, tests);
    }
  };

  const setCode = (code) => {
    setCurrTask((state) => ({
      ...state,
      code,
    }));
  };

  const openTask = (id) => {
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
    actionsTsk: {
      nextTaskOrCompleteTestRun,
      nextTask,
      prevTaskNoPts,
      refreshInput,
      setOutput,
      getSense,
      errorCountDownPressed,
      setCode,
      setRightCode,
      setForbiddenCode,
    },
    currTask,
  };
};

export default useTest;
