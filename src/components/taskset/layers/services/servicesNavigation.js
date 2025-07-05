//data model
import { updateSCP } from "@/db/localstorage";

//repository(external)
import { updateChampPoints } from "@/components/champ/layers/repository/repository";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import navigator from "@/components/Navigator/layers/store/navigator";
import countdownbutton from "@/components/common/CountdownButton/store";
import champ from "@/components/champ/layers/store/champ";
import user from "@/userlayers/store/user";

// service helpers
import {
  setEarned,
  setTaskLog,
  setTaskNumErrorFixed,
  addErrorTaskToRecap,
  setRecapTasks,
  ok,
} from "@/components/taskset/layers/services/servicesHelpers";

export const nextTaskOrCompleteTestRun = async ({ error, errorMsg, code }) => {
  const pts = setEarned(error);
  const tasklog = setTaskLog({ error, code });
  const fixed = setTaskNumErrorFixed(error);
  const { taskstage, nodemode } = taskset.state;

  if (nodemode == "champ" && !error)
    //In order to save champ points on every task execution
    await updateChampPoints({
      pts,
      champid: champ.champid,
      userid: user.userid,
    });
  taskset.updateStateP({ fixed, tasklog, pts });

  const tasknum = taskset.allTasks.length;
  const recapTaskNum = taskset.state.recapTasksIds.length;
  const currTaskId = task.currTaskId;

  switch (true) {
    case currTaskId != tasknum - 1 && !error:
      ok();
      nextTask();
      return;
    case currTaskId == tasknum - 1 && !error:
      if (taskstage == "recap") {
        ok(() =>
          navigator.actions.openCongratPage({
            success: recapTaskNum == fixed,
          })
        );
      }
      if (recapTaskNum == 0 && taskstage == "WIP") {
        ok(() =>
          navigator.actions.openCongratPage({
            success: true,
          })
        );
      }
      if (recapTaskNum != 0 && taskstage == "WIP") {
        taskset.state.nodemode == "exam"
          ? ok(() =>
              navigator.actions.openCongratPage({
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
  const { nodemode, taskstage } = taskset.state;

  if (taskstage == "accomplished_suspended") {
    navigator.actions.openCongratPage({
      success: false,
    });
    return;
  }
  if (taskstage == "recap_suspended") {
    nodemode == "exam"
      ? navigator.actions.openCongratPage({
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
