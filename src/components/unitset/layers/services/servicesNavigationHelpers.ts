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
  tasks,
}: {
  recapTasksIds: number[];
  tasks: Unit[];
}) => {
  const recapTasks = getTasksRecap<Unit>({
    recapTasksIds,
    tasks,
  });
  unitset.setTaskSetTasks({ tasks: recapTasks });
  unit.setCurrUnit(recapTasks[0]);
  unitset.setTaskSetStateP({
    ...unitset.state,
    taskstage: TS.recap,
    currTaskId: 0,
  });
};

export const setTaskNumErrorFixed = (error: boolean) => {
  const fixed = unitset.state.fixed;
  if (unitset.state.taskstage == TS.recap && !error) return fixed + 1;
  if (unitset.state.taskstage == TS.recap && error) return fixed;
  return fixed;
};

export const ok = (action = () => {}) => {
  splash.gotoplayLottie(false, "ok", () => action());
};

export const calcEarned = (error: boolean) => {
  const { tasksetmode, pts = 0, taskstage } = unitset.state;
  const { completed, overflow, remainsum } = chapter.state;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == TS.WIP && !completed && tasksetmode != TSM.exam) {
      income = 10;
    }
    if (taskstage == TS.WIP && !completed && tasksetmode == TSM.exam) {
      income = 2;
    }
    if (taskstage == TS.WIP && completed && tasksetmode != TSM.exam) {
      income = 2;
    }
    if (taskstage == TS.WIP && completed && tasksetmode == TSM.exam) {
      income = 1;
    }

    if (taskstage == TS.recap && !completed && tasksetmode != TSM.exam) {
      income = 2;
    }

    if (taskstage == TS.recap && !completed && tasksetmode == TSM.exam) {
      income = 1;
    }

    if (taskstage == TS.recap && completed) {
      income = 1;
    }
    if (
      tasksetmode == TSM.addhoc ||
      tasksetmode == TSM.newtopic ||
      tasksetmode == TSM.exam
    ) {
      return Math.min(pts + income, remainsum);
    }
    if (tasksetmode == TSM.champ) {
      return pts + income;
    } else return 0;
  } else {
    return pts;
  }
};
