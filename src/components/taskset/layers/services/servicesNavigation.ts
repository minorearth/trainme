//data model
import { updateKeySCP, updateSCP } from "@/db/localstorage";

//repository(external)
import { updateChampPoints } from "@/db/repository/repositoryFBCA";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import navigator from "@/components/Navigator/layers/store/navigator";
import countdownbutton from "@/components/common/CountdownButton/store";
import champ from "@/components/champ/layers/store/champ";
import user from "@/auth/store/user";

// service helpers(local)
import {
  calcEarned,
  setTaskLog,
  setTaskNumErrorFixed,
  setRecapTasks,
  ok,
} from "@/components/taskset/layers/services/servicesNavigationHelpers";
import { ST, TS, TSM } from "tpconst/constants";

export const nextTaskOrCompleteTestRun = async ({
  error,
  errorMsg,
  code,
}: {
  error: boolean;
  errorMsg: string;
  code: string;
}) => {
  const pts = calcEarned(error);
  const tasklog = setTaskLog({ error, code });
  const fixed = setTaskNumErrorFixed(error);
  const { taskstage, tasksetmode } = taskset.state;

  if (tasksetmode == TSM.champ && !error)
    //In order to save champ points on every task execution
    await updateChampPoints({
      pts,
      champid: champ.champid,
      userid: user.userid,
    });
  taskset.setTaskSetStateP({ ...taskset.state, fixed, tasklog, pts });

  const tasknum = taskset.tasks.length;
  const recapTaskNum = taskset.state.recapTasksIds?.length;
  const currTaskId = taskset.state.currTaskId;

  switch (true) {
    case currTaskId != tasknum - 1 && !error:
      ok();
      taskset.nextTask();
      return;
    case currTaskId == tasknum - 1 && !error:
      if (taskstage == TS.recap) {
        ok(() =>
          navigator.actions.openCongratPage({
            success: recapTaskNum == fixed ? ST.success : ST.fail,
          })
        );
      }
      if (recapTaskNum == 0 && taskstage == TS.WIP) {
        ok(() =>
          navigator.actions.openCongratPage({
            success: ST.success,
          })
        );
      }
      if (recapTaskNum != 0 && taskstage == TS.WIP) {
        taskset.state.tasksetmode == TSM.exam
          ? ok(() =>
              navigator.actions.openCongratPage({
                success: ST.fail,
              })
            )
          : ok(() =>
              setRecapTasks({
                recapTasksIds: taskset.state.recapTasksIds,
                tasks: taskset.tasks,
              })
            );
      }
      return;
    case error:
      task.showRightCodeAfterError({ errorMsg });
      if (taskstage == TS.WIP && currTaskId != tasknum - 1) {
        taskset.addErrorTaskToRecap({
          data: {},
          cspcurrtask: currTaskId + 1,
        });
      }

      if (taskstage == TS.recap && currTaskId != tasknum - 1) {
        taskset.setCurrTaskCSPOnly(currTaskId + 1);
      }
      if (taskstage == TS.WIP && currTaskId == tasknum - 1) {
        taskset.addErrorTaskToRecap({
          data: { taskstage: TS.recapSuspended },
          cspcurrtask: 0,
        });
      }
      if (taskstage == TS.recap && currTaskId == tasknum - 1) {
        taskset.setTaskSetStateP({
          ...taskset.state,
          taskstage: TS.accomplishedSuspended,
        });
      }
      return;

    default:
      return "";
  }
};

export const errorCountDownPressed = async () => {
  task.editorRef.current?.setValue("");
  countdownbutton.hideButton();
  task.hideInfo();
  // task.actions.setEditorDisabled(false);
  const { tasksetmode, taskstage } = taskset.state;

  if (taskstage == TS.accomplishedSuspended) {
    navigator.actions.openCongratPage({
      success: ST.fail,
    });
    return;
  }
  if (taskstage == TS.recapSuspended) {
    tasksetmode == TSM.exam
      ? navigator.actions.openCongratPage({
          success: ST.fail,
        })
      : setRecapTasks({
          recapTasksIds: taskset.state.recapTasksIds,
          tasks: taskset.tasks,
        });

    return;
  }
  if (taskset.state.currTaskId != taskset.tasks.length) {
    taskset.switchTaskP(taskset.state.currTaskId + 1);
    return;
  }
};

//UTILITIES
