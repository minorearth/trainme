import { useState, useEffect, useRef } from "react";
import alertdialog from "@/components/common/dialog/store";
import local from "@/globals/local";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import splashCDStore from "@/components/common/splash/splashAction/store";
import { updateSCP } from "@/db/localstorage";
//TODO:check
import "./custom.css";
import { reaction } from "mobx";
import navigator from "@/components/Navigator/store/navigator";
import chapter from "@/components/chapter/store/chapter";
import task from "@/components/chapter/taskrun/store/task";
import { toJS } from "mobx";

const useTask = () => {
  const { openCongratPage, openRecapTasksPage } = navigator.navMethods;
  const { updateChampPoints } = navigator.requestMethods;

  useEffect(() => {
    chapter.setTaskMethods({
      nextTaskOrCompleteTestRun,
      nextTask,
      prevTaskNoPts,
      errorCountDownPressed,
      setRightCode,
      setForbiddenCode,
    });
  }, []);

  const setEditorDisabled = (disabled) => {
    task.editorRef.current.updateOptions({ readOnly: disabled });
  };

  const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
    setEarned(error);
    setTaskLog({ error, code });
    setFixed(error);

    const taskstage = chapter.state.taskstage;
    const tasknum = chapter.allTasks.length;
    const recapTaskNum = chapter.state.recapTasksIds.length;
    const currTaskId = task.currTaskId;

    switch (true) {
      case currTaskId != tasknum - 1 && !error:
        ok();
        nextTask();
        return;
      case currTaskId == tasknum - 1 && !error:
        if (taskstage == "recap") {
          ok(() =>
            openCongratPage({
              state: { chapter, navigator },
              success: recapTaskNum == chapter.state.fixed,
            })
          );
        }
        if (recapTaskNum == 0 && taskstage == "WIP") {
          ok(() =>
            openCongratPage({
              state: { chapter, navigator },
              success: true,
            })
          );
        }
        if (recapTaskNum != 0 && taskstage == "WIP") {
          chapter.state.nodemode == "renewal"
            ? ok(() =>
                openCongratPage({
                  state: { chapter, navigator },
                  success: false,
                })
              )
            : ok(() => openRecapTasksPage(chapter.state.recapTasksIds));
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (taskstage == "WIP" && currTaskId != tasknum - 1) {
          addErrorTaskToRecap();
        }

        if (taskstage == "recap" && currTaskId != tasknum - 1) {
          updateSCP({
            task: { currTaskId: currTaskId + 1 },
          });
        }
        if (taskstage == "WIP" && currTaskId == tasknum - 1) {
          errorOnLastWIPTask();
        }
        if (taskstage == "recap" && currTaskId == tasknum - 1) {
          errorOnLastRecapTask();
        }
        return;

      default:
        return "";
    }
  };

  const setFixed = (error) => {
    const fixed = chapter.state.fixed;
    chapter.state.taskstage == "recap" &&
      !error &&
      updateSCP({
        chapter: { ...chapter.state, fixed: fixed ? fixed + 1 : 1 },
      });
    chapter.updateState({ fixed: fixed ? fixed + 1 : 1 });
  };

  const setTaskLog = ({ code, error }) => {
    const tasklog = chapter.state.tasklog;
    const taskuuid = task.currTask.taskuuid;

    const tasklogdata = !error ? { code } : { errorcode: code };
    const prevTasklogdata = Object.keys(tasklog).includes(taskuuid)
      ? tasklog[taskuuid]
      : {};
    const newChapterState = {
      ...chapter.state,
      tasklog: {
        ...tasklog,
        [taskuuid]: {
          ...prevTasklogdata,
          ...tasklogdata,
        },
      },
    };
    updateSCP({
      chapter: newChapterState,
    });
    chapter.updateState({
      ...newChapterState,
    });
  };

  const nextTask = () => {
    updateSCP({
      task: { currTaskId: task.currTaskId + 1 },
    });

    task.setCurrTask(task.currTaskId + 1);
  };

  const prevTaskNoPts = () => {
    updateSCP({ task: { currTaskId: task.currTaskId - 1 } });
    task.setCurrTask(task.currTaskId - 1);
  };

  const addErrorTaskToRecap = () => {
    const recapTasksIds = [...chapter.state.recapTasksIds, task.currTaskId];
    chapter.updateState({ recapTasksIds });
    task.setCurrTask(task.currTaskId + 1);
    updateSCP({
      chapter: { ...chapter.state, recapTasksIds },
      task: { currTaskId: task.currTaskId + 1 },
    });
  };

  const errorOnLastRecapTask = () => {
    chapter.state.taskstage = "accomplished_suspended";
    updateSCP({
      chapter: { ...chapter.state, taskstage: "accomplished_suspended" },
    });
  };

  const errorOnLastWIPTask = () => {
    const recapTasksIds = [...chapter.state.recapTasksIds, task.currTaskId];
    chapter.state.taskstage = "recap_suspended";
    chapter.state.recapTasksIds = recapTasksIds;
    chapter.updateState({ recapTasksIds, taskstage: "recap_suspended" });
    updateSCP({
      chapter: {
        ...chapter.state,
        taskstage: "recap_suspended",
        recapTasksIds,
      },
    });
  };

  const showRightCodeAfterError = ({ errorMsg }) => {
    alertdialog.showDialog(
      local.ru.msg.alert.PSW_TEST_ERROR,
      errorMsg,
      1,

      () => {
        task.editorRef.current.setValue(
          `'''\n  Правильный код:\n'''\n\n${task.currTask.rightcode} \n\n'''\n  Твой код:\n'''\n\n${task.currTask.code}`
        );

        task.updateCurrTask({
          info: "Изучи правильный код",
          editordisabled: true,
        });
        task.editorRef.current.updateOptions({ lineNumbers: "off" });
        setEditorDisabled(true);
        countdownbutton.showButton();
      }
    );
  };

  const ok = (action = () => {}) => {
    splashCDStore.setShow(false, "ok", 500, () => action());
  };

  const setEarned = (error) => {
    const { taskstage, repeat, overflow, nodemode, champid, pts } =
      chapter.state;
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
        //In order to save champ points on every task execution
        updateChampPoints(income, champid);
      }
    }
    updateSCP({ chapter: { ...chapter.state, pts: pts + income } });
    chapter.updateState({ pts: pts + income });
    return pts;
  };

  const errorCountDownPressed = async () => {
    task.updateCurrTask({ info: "", editordisabled: false });
    task.editorRef.current.updateOptions({ lineNumbers: "on" });
    setEditorDisabled(false);
    const taskstage = chapter.state.taskstage;
    const nodemode = chapter.state.nodemode;

    if (taskstage == "accomplished_suspended") {
      openCongratPage({
        state: { chapter, navigator },
        success: false,
      });
      return;
    }
    if (taskstage == "recap_suspended") {
      nodemode == "renewal"
        ? openCongratPage({
            state: { chapter, navigator },
            success: false,
          })
        : openRecapTasksPage(chapter.state.recapTasksIds);

      return;
    }
    if (task.currTaskId != chapter.allTasks.length) {
      //TODO:smth bad
      // navigator.setAppState({ ...CSP });
      return;
    }
  };

  const setRightCode = () => {
    task.editorRef.current.setValue(task.currTask.rightcode);
  };

  const setForbiddenCode = () => {
    task.editorRef.current.setValue(task.currTask.forbiddencode);
  };

  return {
    actionsTsk: {
      nextTaskOrCompleteTestRun,
      nextTask,
      prevTaskNoPts,
      errorCountDownPressed,
      setRightCode,
      setForbiddenCode,
    },
  };
};

export default useTask;
