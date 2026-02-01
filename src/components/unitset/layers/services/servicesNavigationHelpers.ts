import { toJS } from "mobx";

//stores
import unit from "@/components/unitset/unitrun/layers/store/unit";
import unitset from "@/components/unitset/layers/store/unitset";
import chapter from "@/components/unitset/layers/store/chapter";
import splash from "@/components/common/splash/store";
//

//serviceHelpers(local)
import { getTasksRecap } from "@/components/unitset/layers/services/servicesHelpers";
import { Task, Unit } from "@/tpconst/src/T";
import { TS, TSM } from "@/tpconst/src/const";

export const setTaskLog = ({
  code,
  error,
}: {
  code: string;
  error: boolean;
}) => {
  const tasklog = unitset.state.tasklog;
  const unituuid = unit.currUnit.unituuid;
  if (!tasklog[unituuid]) tasklog[unituuid] = { code: "", errorcode: "" };
  !error
    ? (tasklog[unituuid].code = code)
    : (tasklog[unituuid].errorcode = code);
  return tasklog;
};

export const setRecapTasks = ({
  recapTasksIds,
  units,
}: {
  recapTasksIds: number[];
  units: Unit[];
}) => {
  const recapTasks = getTasksRecap<Unit>({
    recapTasksIds,
    units,
  });
  unitset.setUnitSetUnits({ units: recapTasks });
  unit.setCurrUnit(recapTasks[0]);
  unitset.setUnitSetStateP({
    ...unitset.state,
    unitsetstage: TS.recap,
    currUnitId: 0,
  });
};

export const setTaskNumErrorFixed = (error: boolean) => {
  const fixed = unitset.state.fixed;
  if (unitset.state.unitsetstage == TS.recap && !error) return fixed + 1;
  if (unitset.state.unitsetstage == TS.recap && error) return fixed;
  return fixed;
};

export const ok = (action = () => {}) => {
  splash.gotoplayLottie(false, "ok", () => action());
};

export const calcEarned = (error: boolean) => {
  const { unitsetmode, pts = 0, unitsetstage } = unitset.state;
  const { completed, overflow, remainsum } = chapter.state;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (unitsetstage == TS.WIP && !completed && unitsetmode != TSM.exam) {
      income = 10;
    }
    if (unitsetstage == TS.WIP && !completed && unitsetmode == TSM.exam) {
      income = 2;
    }
    if (unitsetstage == TS.WIP && completed && unitsetmode != TSM.exam) {
      income = 2;
    }
    if (unitsetstage == TS.WIP && completed && unitsetmode == TSM.exam) {
      income = 1;
    }

    if (unitsetstage == TS.recap && !completed && unitsetmode != TSM.exam) {
      income = 2;
    }

    if (unitsetstage == TS.recap && !completed && unitsetmode == TSM.exam) {
      income = 1;
    }

    if (unitsetstage == TS.recap && completed) {
      income = 1;
    }
    if (
      unitsetmode == TSM.addhoc ||
      unitsetmode == TSM.newtopic ||
      unitsetmode == TSM.exam
    ) {
      return Math.min(pts + income, remainsum);
    }
    if (unitsetmode == TSM.champ) {
      return pts + income;
    } else return 0;
  } else {
    return pts;
  }
};
