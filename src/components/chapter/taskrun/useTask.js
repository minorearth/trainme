import { useState, useEffect, useRef } from "react";
import alertdialog from "@/components/common/dialog/store";
import local from "@/globals/local";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import splashCDStore from "@/components/common/splash/splashAction/store";
import { updateSCP } from "@/db/localstorage";
//TODO:check
import "./custom.css";
import navigator from "@/components/Navigator/store/navigator";
import chapter from "@/components/chapter/store/chapter";
import task from "@/components/chapter/taskrun/store/task";
import champ from "@/components/champ/store/champ";
import { toJS } from "mobx";
import { updateChampPoints } from "@/components/champ/store/champVM";

const useTask = () => {
  const { openCongratPage, openRecapTasksPage } = navigator.navMethods;

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

    const tasknum = chapter.allTasks.length;
    const recapTaskNum = chapter.state.recapTasksIds.length;
    const currTaskId = task.currTaskId;
    const { nodemode, pts, remainsum, taskstage } = chapter.state;

    switch (true) {
      case currTaskId != tasknum - 1 && !error:
        ok();
        nextTask();
        return;
      case currTaskId == tasknum - 1 && !error:
        if (taskstage == "recap") {
          ok(() =>
            openCongratPage({
              nodemode,
              pts,
              remainsum,
              success: recapTaskNum == chapter.state.fixed,
            })
          );
        }
        if (recapTaskNum == 0 && taskstage == "WIP") {
          ok(() =>
            openCongratPage({
              nodemode,
              pts,
              remainsum,
              success: true,
            })
          );
        }
        if (recapTaskNum != 0 && taskstage == "WIP") {
          chapter.state.nodemode == "renewal"
            ? ok(() =>
                openCongratPage({
                  nodemode,
                  pts,
                  remainsum,
                  success: false,
                })
              )
            : ok(() =>
                openRecapTasksPage({
                  chapter: { state: chapter.state, allTasks: chapter.allTasks },
                })
              );
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (taskstage == "WIP" && currTaskId != tasknum - 1) {
          addErrorTaskToRecap();
          updateSCP({
            task: { currTaskId: currTaskId + 1 },
          });
        }

        if (taskstage == "recap" && currTaskId != tasknum - 1) {
          updateSCP({
            task: { currTaskId: currTaskId + 1 },
          });
        }
        if (taskstage == "WIP" && currTaskId == tasknum - 1) {
          addErrorTaskToRecap();
          chapter.updateState({ taskstage: "recap_suspended" });
        }
        if (taskstage == "recap" && currTaskId == tasknum - 1) {
          chapter.updateState({ taskstage: "accomplished_suspended" });
        }
        return;

      default:
        return "";
    }
  };

  const setFixed = (error) => {
    const fixed = chapter.state.fixed;
    if (chapter.state.taskstage == "recap" && !error) {
      chapter.updateState({ fixed: fixed ? fixed + 1 : 1 });
    }
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
    chapter.updateState(newChapterState);
  };

  const nextTask = () => {
    task.setCurrTask(task.currTaskId + 1);
  };

  const prevTaskNoPts = () => {
    task.setCurrTask(task.currTaskId - 1);
  };

  const addErrorTaskToRecap = () => {
    const recapTasksIds = [...chapter.state.recapTasksIds, task.currTaskId];
    chapter.updateState({ recapTasksIds });
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
    const { taskstage, repeat, overflow, nodemode, pts } = chapter.state;
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
        updateChampPoints(income, champ.champid);
      }
    }
    chapter.updateState({ pts: pts + income });
    return pts;
  };

  const errorCountDownPressed = async () => {
    task.updateCurrTask({ info: "", editordisabled: false });
    task.editorRef.current.updateOptions({ lineNumbers: "on" });
    setEditorDisabled(false);
    const { nodemode, pts, remainsum, taskstage } = chapter.state;

    if (taskstage == "accomplished_suspended") {
      openCongratPage({
        nodemode,
        pts,
        remainsum,
        success: false,
      });
      return;
    }
    if (taskstage == "recap_suspended") {
      nodemode == "renewal"
        ? openCongratPage({
            nodemode,
            pts,
            remainsum,
            success: false,
          })
        : openRecapTasksPage({
            chapter: { state: chapter.state, allTasks: chapter.allTasks },
          });

      return;
    }
    if (task.currTaskId != chapter.allTasks.length) {
      task.setCurrTask(task.currTaskId + 1);
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
