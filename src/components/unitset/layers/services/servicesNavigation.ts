//repository(external)
import { updateChampPoints } from "@/tpconst/src/RP/FB";

//stores
import unit from "@/components/unitset/unitrun/layers/store/unit";

import unitset from "@/components/unitset/layers/store/unitset";
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
} from "@/components/unitset/layers/services/servicesNavigationHelpers";
import { ST, TS, TSM } from "@/tpconst/src/const";
import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "@/tpconst/src/lang";
import { E_CODES } from "@/tpconst/src/errorHandlers";

export const nextTaskOrCompleteTestRun = async ({
  error,
  errorMsg = "",
  code,
}: {
  error: boolean;
  errorMsg?: string;
  code: string;
}) => {
  const pts = calcEarned(error);
  const tasklog = setTaskLog({ error, code });
  const fixed = setTaskNumErrorFixed(error);
  const { taskstage, tasksetmode } = unitset.state;
  unitset.setTaskSetStateP({ ...unitset.state, fixed, tasklog, pts });
  const tasknum = unitset.tasks.length;
  const recapTaskNum = unitset.state.recapTasksIds?.length;
  const currTaskId = unitset.state.currTaskId;

  switch (true) {
    case !error:
      if (tasksetmode == TSM.champ)
        //In order to save champ points on every task execution
        await updateChampPoints({
          pts,
          champid: champ.champid,
          userid: user.userid,
        });
      if (currTaskId != tasknum - 1) {
        ok();
        unitset.nextTask();
        return;
      }
      if (currTaskId == tasknum - 1) {
        if (taskstage == TS.recap) {
          ok(() =>
            navigator.actions.openCongratPage({
              success: recapTaskNum == fixed ? ST.success : ST.fail,
            }),
          );
        }
        if (recapTaskNum == 0 && taskstage == TS.WIP) {
          ok(() =>
            navigator.actions.openCongratPage({
              success: ST.success,
            }),
          );
        }
        if (recapTaskNum != 0 && taskstage == TS.WIP) {
          unitset.state.tasksetmode == TSM.exam
            ? ok(() =>
                navigator.actions.openCongratPage({
                  success: ST.fail,
                }),
              )
            : ok(() =>
                setRecapTasks({
                  recapTasksIds: unitset.state.recapTasksIds,
                  tasks: unitset.tasks,
                }),
              );
        }
      }
      return;
    case error:
      unit.showRightCodeAfterError({ errorMsg });
      if (taskstage == TS.WIP && currTaskId != tasknum - 1) {
        unitset.addErrorTaskToRecap({
          data: {},
          cspcurrtask: currTaskId + 1,
        });
      }
      if (taskstage == TS.recap && currTaskId != tasknum - 1) {
        unitset.setCurrTaskCSPOnly(currTaskId + 1);
      }
      if (taskstage == TS.WIP && currTaskId == tasknum - 1) {
        unitset.addErrorTaskToRecap({
          data: { taskstage: TS.recapSuspended },
          cspcurrtask: 0,
        });
      }
      if (taskstage == TS.recap && currTaskId == tasknum - 1) {
        unitset.setTaskSetStateP({
          ...unitset.state,
          taskstage: TS.accomplishedSuspended,
        });
      }
      return;
    default:
      return "";
  }
};

export const errorCountDownPressed = async () => {
  // if (!task.monaco) {
  //   throw new Error();
  // }
  unit.editors[0].editorRef.current?.setValue("");
  countdownbutton.hideButton();
  unit.hideInfo();
  // task.actions.setEditorDisabled(false);
  const { tasksetmode, taskstage } = unitset.state;

  if (taskstage == TS.accomplishedSuspended) {
    navigator.actions.openCongratPage({
      success: ST.fail,
    });
    return;
  }
  if (taskstage == TS.recapSuspended) {
    if (tasksetmode == TSM.exam) {
      navigator.actions.openCongratPage({
        success: ST.fail,
      });
    } else {
      dialogs.basic({
        ...L.ru.msg[E_CODES.RECAP].params,
      });
      setRecapTasks({
        recapTasksIds: unitset.state.recapTasksIds,
        tasks: unitset.tasks,
      });
    }

    return;
  }
  if (unitset.state.currTaskId != unitset.tasks.length) {
    unitset.switchTaskP(unitset.state.currTaskId + 1);
    return;
  }
};

//UTILITIES
