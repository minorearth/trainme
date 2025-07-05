//data model
import { updateSCP } from "@/db/localstorage";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import navigator from "@/components/Navigator/layers/store/navigator";
import countdownbutton from "@/components/common/CountdownButton/store";

//

import {
  setEarned,
  setTaskLog,
  setFixed,
  addErrorTaskToRecap,
  setRecapTasks,
  ok,
} from "@/components/taskset/layers/services/utils";

export const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
  setEarned(error);
  setTaskLog({ error, code });
  setFixed(error);

  const tasknum = taskset.allTasks.length;
  const recapTaskNum = taskset.state.recapTasksIds.length;
  const currTaskId = task.currTaskId;
  const { nodemode, pts, remainsum, taskstage } = taskset.state;

  switch (true) {
    case currTaskId != tasknum - 1 && !error:
      ok();
      nextTask();
      return;
    case currTaskId == tasknum - 1 && !error:
      if (taskstage == "recap") {
        ok(() =>
          navigator.actions.openCongratPage({
            nodemode,
            pts,
            remainsum,
            success: recapTaskNum == taskset.state.fixed,
          })
        );
      }
      if (recapTaskNum == 0 && taskstage == "WIP") {
        ok(() =>
          navigator.actions.openCongratPage({
            nodemode,
            pts,
            remainsum,
            success: true,
          })
        );
      }
      if (recapTaskNum != 0 && taskstage == "WIP") {
        taskset.state.nodemode == "exam"
          ? ok(() =>
              navigator.actions.openCongratPage({
                nodemode,
                pts,
                remainsum,
                success: false,
              })
            )
          : ok(() =>
              setRecapTasks({
                tasksetState: {
                  state: taskset.state,
                  allTasks: taskset.allTasks,
                },
              })
            );
      }
      return;
    case error:
      task.actions.showRightCodeAfterError({ errorMsg });
      if (taskstage == "WIP" && currTaskId != tasknum - 1) {
        addErrorTaskToRecap();
        //TODO: do via store
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
        taskset.updateStateP({ taskstage: "recap_suspended" });
        task.setCurrTaskCSPOnly(0);
      }
      if (taskstage == "recap" && currTaskId == tasknum - 1) {
        taskset.updateStateP({ taskstage: "accomplished_suspended" });
      }
      return;

    default:
      return "";
  }
};

export const nextTask = () => {
  task.editorRef.current.setValue("");
  task.setCurrTaskP(task.currTaskId + 1);
};

export const prevTaskNoPts_admin = () => {
  task.editorRef.current.setValue("");
  task.setCurrTaskP(task.currTaskId - 1);
};

export const errorCountDownPressed = async () => {
  task.editorRef.current.setValue("");
  countdownbutton.hideButton();
  task.updateCurrTask({ info: "", editordisabled: false });
  task.actions.setEditorDisabled(false);
  const { nodemode, pts, remainsum, taskstage } = taskset.state;

  if (taskstage == "accomplished_suspended") {
    navigator.actions.openCongratPage({
      nodemode,
      pts,
      remainsum,
      success: false,
    });
    return;
  }
  if (taskstage == "recap_suspended") {
    nodemode == "exam"
      ? navigator.actions.openCongratPage({
          nodemode,
          pts,
          remainsum,
          success: false,
        })
      : setRecapTasks({
          tasksetState: { state: taskset.state, allTasks: taskset.allTasks },
        });

    return;
  }
  if (task.currTaskId != taskset.allTasks.length) {
    task.setCurrTaskP(task.currTaskId + 1);
    return;
  }
};

//UTILITIES
