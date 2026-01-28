import { toJS } from "mobx";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import chapter from "@/components/taskset/layers/store/chapter";
import splash from "@/components/common/splash/store";
//

//serviceHelpers(local)
import { getTasksRecap } from "@/components/taskset/layers/services/servicesHelpers";
import { Task, Unit } from "@/tpconst/src/T";
import { TS, TSM } from "@/tpconst/src/const";

export const setTaskLog = ({
  code,
  error,
}: {
  code: string;
  error: boolean;
}) => {
  const tasklog = taskset.state.tasklog;
  const taskuuid = task.currTask.taskuuid;
  if (!tasklog[taskuuid]) tasklog[taskuuid] = { code: "", errorcode: "" };
  !error
    ? (tasklog[taskuuid].code = code)
    : (tasklog[taskuuid].errorcode = code);
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
  taskset.setTaskSetTasks({ tasks: recapTasks });
  task.setCurrTask(recapTasks[0]);
  taskset.setTaskSetStateP({
    ...taskset.state,
    taskstage: TS.recap,
    currTaskId: 0,
  });
};

export const setTaskNumErrorFixed = (error: boolean) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == TS.recap && !error) return fixed + 1;
  if (taskset.state.taskstage == TS.recap && error) return fixed;
  return fixed;
};

export const ok = (action = () => {}) => {
  splash.gotoplayLottie(false, "ok", () => action());
};

export const calcEarned = (error: boolean) => {
  const { tasksetmode, pts = 0, taskstage } = taskset.state;
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
