import { useState, useEffect, useRef } from "react";
import alertdialog from "@/components/common/dialog/store";
import local from "@/globals/local";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import splashCDStore from "@/components/common/splash/splashAction/store";
import { getSense, getCSP, setCSP, updateSCP } from "@/db/localstorage";
import "./custom.css";

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
    appState.taskId != tests.length && openTask(appState.taskId, editorRef);
    // editorRef?.current?.getModel().setValue(currTask?.code);
  }, [appState.taskId]);

  const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
    // editorRef.current.getModel().setValue("");
    setEarned(error);
    //TODO:
    setTaskLog({ error, code });

    // CSP.nodemode != "champ" && setTaskLog({ error, code });
    const CSP = getCSP();

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
        updateCurrTask({
          code: tests[appState.taskId].rightcode,
          info: "Правильный код",
        });
        setEditorDisabled(true);
        countdownbutton.showButton();
      }
    );
  };

  const handleChangeContent = ({ value }) => {
    const model = editorRef.current.getModel();
    const lineCount = model.getLineCount();
    lineCount > currTask.maxlines && currTask.tasktype != "guide"
      ? updateCurrTask({
          code: value ?? "",
          maxlineserror: "Превышено максимальное количество строк",
        })
      : updateCurrTask({ code: value ?? "", maxlineserror: "" });
  };

  const ok = (action = () => {}) => {
    splashCDStore.setShow(false, "ok", 500, () => action());
  };

  const setEarned = (error) => {
    const CSP = getCSP();
    const taskstage = CSP.taskstage;
    const repeat = CSP.repeat;
    const overflow = CSP.overflow;
    const nodemode = CSP.nodemode;
    const champid = CSP.champid;
    let pts = getSense();
    let income = 0;
    if (overflow) {
      return pts;
    }
    if (!error) {
      if (taskstage == "WIP" && !repeat && nodemode != "renewal") {
        income = 10;
      }
      if (taskstage == "WIP" && !repeat && nodemode == "renewal") {
        income = 2;
      }
      if (taskstage == "WIP" && repeat && nodemode != "renewal") {
        income = 2;
      }
      if (taskstage == "WIP" && repeat && nodemode == "renewal") {
        income = 1;
      }

      if (taskstage == "recap" && !repeat && nodemode != "renewal") {
        income = 2;
      }

      if (taskstage == "recap" && !repeat && nodemode == "renewal") {
        income = 1;
      }

      if (taskstage == "recap" && repeat) {
        income = 1;
      }
      if (nodemode == "champ") {
        actionsNAV.updateChampPoins(income, champid);
      }
    }
    updateSCP({ pts: pts + income });
    return pts;
  };

  const updateCurrTask = (data) => {
    setCurrTask((state) => ({
      ...state,
      ...data,
    }));
  };

  const errorCountDownPressed = async () => {
    // editorRef.current.getModel().setValue("");
    updateCurrTask({ info: "" });
    setEditorDisabled(false);
    const CSP = getCSP();
    // if (CSP.taskId != tests.length - 1) {

    if (CSP.taskstage == "accomplished_suspended") {
      openCongratPage({ CSP });
      return;
    }
    if (CSP.taskstage == "recap_suspended") {
      openRecapTasksPage(CSP.recapTasksIds, tests);
      return;
    }
    if (CSP.taskId != tests.length) {
      setappState({ ...CSP });
      return;
    }
  };

  const openTask = (id, editorRef) => {
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
      maxlines: test.restrictions.maxlines,

      output: "",
      restrictErrors: "",
    });
  };

  const setRightCode = (id) => {
    editorRef.current.setValue(tests[appState.taskId].rightcode);

    //controlled version  do not remove
    // const test = tests[id];
    // setCurrTask((state) => ({
    //   ...state,
    //   code: test.rightcode,
    // }));
  };

  const setForbiddenCode = (id) => {
    editorRef.current.setValue(tests[appState.taskId].forbiddencode);
    //controlled version  do not remove

    // const test = tests[id];
    // setCurrTask((state) => ({
    //   ...state,
    //   code: test.forbiddencode,
    // }));
  };

  const refreshInput = () => {
    const test = tests[appState.taskId];
    const input = test.defaultinput.join("\n");
    currTask.input = input;
    setCurrTask((state) => ({ ...state, input }));
  };

  const refreshEditor = () => {
    // both are worked
    editorRef.current.setValue(tests[appState.taskId].defaultcode);
    // editorRef.current.getModel().setValue(tests[appState.taskId].defaultcode);
  };

  //UTILIIES
  const getForbiddenSample = {
    "f-строки": "Пример: f'Привет, {a}",
    "индексы строк": "Пример: a=b[2]",
    срезы: "Пример: a=b[1:5:-1]",
    "списковые включения": "Пример: [i for i in range(a)]",
    списки: "Пример, a.append(b), print(a[i])",
    "тернарный оператор": "Пример: a if a>b else b",
    "условный оператор in": "Пример: if a in b: print(a)",
    "функция sum": "Пример: sum([1,2,3])",
    "функция count": "Пример: a.count('A')",
    "функция max": "Пример: max([1,2,3])",
    "функция min": "Пример: min([1,2,3]",
    "функция len": "Пример: len([1,2,3]),len('ABC')",
    "функция map": "Пример: map(int, a)",
    "функция list": "Пример: list('ABC')",
    "функция join": "Пример: a=''.join(b)",
    "функция split": "Пример: a=b.split()",
    "функция find": "Пример: a=b.find('A')",
    "функция rfind": "Пример: a=b.rfind('A')",
    "функция replace": "Пример: a=a.replace('A','B')",
  };

  const formatForbidden = (forbidden, forbiddenRe, maxlines, tasktype) => {
    let res = "";
    if (tasktype != "task") {
      return "";
    }
    res += `\n\n<b>Ограничения</b>:\nМаксимальное количество строк кода: ${maxlines}`;

    if (forbidden.length) {
      // res += `\nЗапрещенные приёмы: <div class="tooltip"><span class="tooltiptext">[i for i in range(a)]</span>${forbidden.join(
      //   "</div>,<div class='tooltip'><span class='tooltiptext'>[i for i in range(a)]</span>"
      // )}</div>`;
      res += `\nЗапрещенные приёмы:`;
      for (let i = 0; i < forbidden.length; i++) {
        res += `<div class="tooltip">${
          forbidden[i]
        }, <span class="tooltiptext">${
          getForbiddenSample[forbidden[i]]
        }</span></div>`;
      }
    }

    return res;
  };

  return {
    actionsTsk: {
      nextTaskOrCompleteTestRun,
      nextTask,
      prevTaskNoPts,
      refreshInput,
      refreshEditor,
      updateCurrTask,
      errorCountDownPressed,
      updateCurrTask,
      setRightCode,
      setForbiddenCode,
      handleChangeContent,
    },
    currTask,
  };
};

export default useTest;
