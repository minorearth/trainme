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

export const nextUnitOrCompleteUnitsRun = async ({
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
  const { unitsetstage, unitsetmode } = unitset.state;
  unitset.setUnitSetStateP({ ...unitset.state, fixed, tasklog, pts });
  const unitnum = unitset.units.length;
  const recapTaskNum = unitset.state.recapTasksIds?.length;
  const currUnitId = unitset.state.currUnitId;

  switch (true) {
    case !error:
      if (unitsetmode == TSM.champ)
        //In order to save champ points on every task execution
        await updateChampPoints({
          pts,
          champid: champ.champid,
          userid: user.userid,
        });
      if (currUnitId != unitnum - 1) {
        ok();
        unitset.nextUnit();
        return;
      }
      if (currUnitId == unitnum - 1) {
        if (unitsetstage == TS.recap) {
          ok(() =>
            navigator.actions.openCongratPage({
              success: recapTaskNum == fixed ? ST.success : ST.fail,
            }),
          );
        }
        if (recapTaskNum == 0 && unitsetstage == TS.WIP) {
          ok(() =>
            navigator.actions.openCongratPage({
              success: ST.success,
            }),
          );
        }
        if (recapTaskNum != 0 && unitsetstage == TS.WIP) {
          unitset.state.unitsetmode == TSM.exam
            ? ok(() =>
                navigator.actions.openCongratPage({
                  success: ST.fail,
                }),
              )
            : ok(() =>
                setRecapTasks({
                  recapTasksIds: unitset.state.recapTasksIds,
                  units: unitset.units,
                }),
              );
        }
      }
      return;
    case error:
      unit.showRightCodeAfterError({ errorMsg });
      if (unitsetstage == TS.WIP && currUnitId != unitnum - 1) {
        unitset.addErrorTaskToRecap({
          data: {},
          cspcurrtask: currUnitId + 1,
        });
      }
      if (unitsetstage == TS.recap && currUnitId != unitnum - 1) {
        unitset.setCurrUnitCSPOnly(currUnitId + 1);
      }
      if (unitsetstage == TS.WIP && currUnitId == unitnum - 1) {
        unitset.addErrorTaskToRecap({
          data: { unitsetstage: TS.recapSuspended },
          cspcurrtask: 0,
        });
      }
      if (unitsetstage == TS.recap && currUnitId == unitnum - 1) {
        unitset.setUnitSetStateP({
          ...unitset.state,
          unitsetstage: TS.accomplishedSuspended,
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
  const { unitsetmode, unitsetstage } = unitset.state;

  if (unitsetstage == TS.accomplishedSuspended) {
    navigator.actions.openCongratPage({
      success: ST.fail,
    });
    return;
  }
  if (unitsetstage == TS.recapSuspended) {
    if (unitsetmode == TSM.exam) {
      navigator.actions.openCongratPage({
        success: ST.fail,
      });
    } else {
      dialogs.basic({
        ...L.ru.msg[E_CODES.RECAP].params,
      });
      setRecapTasks({
        recapTasksIds: unitset.state.recapTasksIds,
        units: unitset.units,
      });
    }

    return;
  }
  if (unitset.state.currUnitId != unitset.units.length) {
    unitset.switchTaskP(unitset.state.currUnitId + 1);
    return;
  }
};

//UTILITIES
