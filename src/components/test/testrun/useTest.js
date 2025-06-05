import { useState, useEffect, useRef } from "react";
import alertdialog from "@/components/common/dialog/store";
import local from "@/globals/local";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import splashCDStore from "@/components/common/splash/splashAction/store";
import { getSense, getCSP, setCSP, updateSCP } from "@/db/localstorage";
import "./custom.css";
import AS from "@/store/appstate";
import { reaction } from "mobx";

const useTest = ({ tasks, actionsNAV, editorRef, setEditorDisabled }) => {
  const { openCongratPage, openRecapTasksPage, setStateAndCSP } = actionsNAV;

  const [currTask, setCurrTask] = useState({});

  useEffect(() => {
    const loadTasks = async () => {
      await loadAllFiles(tasks);
      AS.as.taskId != tasks.length && openTask(AS.as.taskId);
    };
    loadTasks();

    return reaction(
      () => AS.as.taskId,
      (taskId) => {
        console.log("тута2", taskId, taskId != "", tasks.length);
        taskId != tasks.length && openTask(taskId);
      }
    );
  }, []);

  const fetchFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      return data.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  //  const createfile = (data, filename) => {
  //   return `f=open("${filename}", 'w')\nf.write("${data}")\nf.close()\n`;
  // };

  const loadAllFiles = async (tasks) => {
    const files = {};
    tasks.forEach((task) => {
      task.inout.forEach((inout) => {
        inout.inv
          .filter((item) => item.includes(".txt"))
          .forEach(
            (item) =>
              (files[item] = {
                fileurl:
                  "https://hog6lcngzkudsdma.public.blob.vercel-storage.com/a3905595-437e-47f3-b749-28ea5362bd39/d06b8c0d-4837-484a-ad85-9257e0e6af01/" +
                  item,
              })
          );
      });
    });

    await Promise.all(
      Object.keys(files).map(async (file) => {
        files[file] = {
          fileurl: files[file].fileurl,
          data: await fetchFile(files[file].fileurl),
        };
      })
    );

    tasks.forEach((task) => {
      task.inout.forEach((inouttest) => {
        inouttest.filesdata = [];
        inouttest.inv.forEach((item) => {
          item.includes(".txt")
            ? inouttest.filesdata.push(
                `f=open("${item}", 'w')\nf.write("${files[item].data}")\nf.close()\n`
              )
            : inouttest.filesdata.push("");
        });
      });
    });

    console.log("kkk", tasks);
  };

  const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
    setEarned(error);
    setTaskLog({ error, code });
    setFixed(error);

    const CSP = getCSP();

    switch (true) {
      case CSP.taskId != tasks.length - 1 && !error:
        ok();
        nextTask({ CSP });
        return;
      case CSP.taskId == tasks.length - 1 && !error:
        if (CSP.taskstage == "recap") {
          ok(() =>
            openCongratPage({
              CSP,
              success: CSP.recapTasksIds.length == CSP.fixed,
            })
          );
        }
        if (CSP.recapTasksIds.length == 0 && CSP.taskstage == "WIP") {
          ok(() => openCongratPage({ CSP, success: true }));
        }
        if (CSP.recapTasksIds.length != 0 && CSP.taskstage == "WIP") {
          CSP.nodemode == "renewal"
            ? ok(() => openCongratPage({ CSP, success: false }))
            : ok(() => openRecapTasksPage(CSP.recapTasksIds, tasks));
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (CSP.taskstage == "WIP" && CSP.taskId != tasks.length - 1) {
          addErrorTaskToRecap({ CSP });
        }

        if (CSP.taskstage == "recap" && CSP.taskId != tasks.length - 1) {
          updateSCP({
            taskId: CSP.taskId + 1,
          });
        }
        if (CSP.taskstage == "WIP" && CSP.taskId == tasks.length - 1) {
          errorOnLastWIPTask();
        }
        if (CSP.taskstage == "recap" && CSP.taskId == tasks.length - 1) {
          errorOnLastRecapTask();
        }
        return;

      default:
        return "";
    }
  };

  const setFixed = (error) => {
    const CSP = getCSP();
    CSP.taskstage == "recap" &&
      !error &&
      updateSCP({ fixed: CSP.fixed ? CSP.fixed + 1 : 1 });
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
    setStateAndCSP({
      ...CSP,
      taskId: CSP.taskId + 1,
    });
  };

  const prevTaskNoPts = () => {
    const CSP = getCSP();
    setStateAndCSP({ ...CSP, taskId: CSP.taskId - 1 });
  };

  const addErrorTaskToRecap = ({ CSP }) => {
    const recapTasksIds = [...CSP.recapTasksIds, AS.as.taskId];
    setCSP({
      ...CSP,
      recapTasksIds,
      taskId: AS.as.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    AS.as.taskstage = "accomplished_suspended";
    updateSCP({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    AS.as.taskstage = "recap_suspended";
    const recapTasksIds = [...AS.as.recapTasksIds, AS.as.taskId];
    AS.as.recapTasksIds = recapTasksIds;
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
        editorRef.current.setValue(
          `'''\n  Правильный код:\n'''\n\n${
            tasks[AS.as.taskId].rightcode
          } \n\n'''\n  Твой код:\n'''\n\n${currTask.code}`
        );

        updateCurrTask({
          info: "Изучи правильный код",
          editordisabled: true,
        });
        editorRef.current.updateOptions({ lineNumbers: "off" });
        setEditorDisabled(true);
        countdownbutton.showButton();
      }
    );
  };

  const handleChangeContent = ({ value }) => {
    const model = editorRef.current.getModel();
    const lineCount = model.getLineCount();
    console.log("check66", value);

    lineCount > currTask.maxlines && currTask.tasktype != "guide"
      ? updateCurrTask({
          code: value || "",
          maxlineserror: "Превышено максимальное количество строк",
        })
      : updateCurrTask({ code: value || "", maxlineserror: "" });
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
    console.log("check2", data);

    setCurrTask((state) => ({
      ...state,
      ...data,
    }));
  };

  const errorCountDownPressed = async () => {
    console.log("check9");

    updateCurrTask({ info: "", editordisabled: false });
    editorRef.current.updateOptions({ lineNumbers: "on" });
    setEditorDisabled(false);
    const CSP = getCSP();

    if (CSP.taskstage == "accomplished_suspended") {
      openCongratPage({ CSP, success: false });
      return;
    }
    if (CSP.taskstage == "recap_suspended") {
      CSP.nodemode == "renewal"
        ? openCongratPage({ CSP, success: false })
        : openRecapTasksPage(CSP.recapTasksIds, tasks);

      return;
    }
    if (CSP.taskId != tasks.length) {
      AS.setAppState({ ...CSP });
      return;
    }
  };

  const openTask = (id) => {
    const task = tasks[id];
    console.log("check3");

    setCurrTask({
      task:
        task.task +
        formatForbidden(
          task.restrictions.forbidden,
          task.restrictions.forbiddenRe,
          task.restrictions.maxlines,
          task.tasktype
        ),
      tasktype: task.tasktype,
      input: task.defaultinput.join("\n"),
      code: task.defaultcode,
      expectedOutput: task.defaultoutput.join("\n"),
      taskuuid: task.taskuuid,
      maxlines: task.restrictions.maxlines,
      filedata: task.inout[0].filesdata.join("\n"),
      output: "",
      restrictErrors: "",
    });
  };

  const setRightCode = () => {
    editorRef.current.setValue(tasks[AS.as.taskId].rightcode);
  };

  const setForbiddenCode = () => {
    editorRef.current.setValue(tasks[AS.as.taskId].forbiddencode);
  };

  const refreshInput = () => {
    const test = tasks[AS.as.taskId];
    const input = test.defaultinput.join("\n");
    currTask.input = input;
    console.log("check4");
    setCurrTask((state) => ({ ...state, input }));
  };

  const refreshEditor = () => {
    editorRef.current.setValue(tasks[AS.as.taskId].defaultcode);
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
