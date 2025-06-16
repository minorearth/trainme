//data model
import { updateSCP } from "@/db/localstorage";

//stores
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import splashCDStore from "@/components/common/splash/splashAction/store";
import navigator from "@/components/Navigator/store/navigator";
//

import {
  setEarned,
  setTaskLog,
  setFixed,
  addErrorTaskToRecap,
} from "@/components/chapter/store/chapterUtilsMobx";

import {
  showRightCodeAfterError,
  setEditorDisabled,
} from "@/components/chapter/taskrun/store/taskMobx";

export const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
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
          navigator.navMethods.openCongratPage({
            nodemode,
            pts,
            remainsum,
            success: recapTaskNum == chapter.state.fixed,
          })
        );
      }
      if (recapTaskNum == 0 && taskstage == "WIP") {
        ok(() =>
          navigator.navMethods.openCongratPage({
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
              navigator.navMethods.openCongratPage({
                nodemode,
                pts,
                remainsum,
                success: false,
              })
            )
          : ok(() =>
              navigator.navMethods.openRecapTasksPage({
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

export const nextTask = () => {
  task.setCurrTask(task.currTaskId + 1);
};

export const prevTaskNoPts = () => {
  task.setCurrTask(task.currTaskId - 1);
};

const ok = (action = () => {}) => {
  splashCDStore.setShow(false, "ok", 500, () => action());
};

export const errorCountDownPressed = async () => {
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
