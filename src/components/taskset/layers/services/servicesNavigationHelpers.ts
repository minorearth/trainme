import { toJS } from "mobx";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import chapter from "@/components/taskset/layers/store/chapter";
import splash from "@/components/common/splash/store";
//

//serviceHelpers(local)
import { getTasksRecap } from "@/components/taskset/layers/services/servicesHelpers";
import { RawTask, TasksetState, Task } from "@/types";

export const setTaskLog = ({
  code,
  error,
}: {
  code: string;
  error: boolean;
}) => {
  const tasklog = taskset.state.tasklog;
  const taskuuid = task.currTask.taskuuid;

  const tasklogdata = !error ? { code } : { errorcode: code };
  const prevTasklogdata = Object.keys(tasklog).includes(taskuuid)
    ? tasklog[taskuuid]
    : {};
  return {
    ...tasklog,
    [taskuuid]: {
      ...prevTasklogdata,
      ...tasklogdata,
    },
  };
};

export const addErrorTaskToRecap = () => {
  const recapTasksIds = [...taskset.state.recapTasksIds, task.currTaskId];
  taskset.setStateP({ ...taskset.state, recapTasksIds });
};

export const setRecapTasks = ({
  recapTasksIds,
  tasks,
}: {
  recapTasksIds: number[];
  tasks: Task[] | RawTask[];
}) => {
  const recapTasks = getTasksRecap({
    recapTasksIds,
    tasks,
  });
  taskset.setTasks(recapTasks as Task[], 0);
  taskset.setStateP({ ...taskset.state, taskstage: "recap" });
};

export const setTaskNumErrorFixed = (error: boolean) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == "recap" && !error) return fixed + 1;
  if (taskset.state.taskstage == "recap" && error) return fixed;
  return fixed;
};

export const ok = (action = () => {}) => {
  splash.setGotoplayLottie(false, "ok", () => action());
};

export const calcEarned = (error: boolean) => {
  const { tasksetmode, pts = 0, taskstage } = taskset.state;
  const { completed, overflow, remainsum } = chapter.chapter;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == "WIP" && !completed && tasksetmode != "exam") {
      income = 10;
    }
    if (taskstage == "WIP" && !completed && tasksetmode == "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && completed && tasksetmode != "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && completed && tasksetmode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && !completed && tasksetmode != "exam") {
      income = 2;
    }

    if (taskstage == "recap" && !completed && tasksetmode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && completed) {
      income = 1;
    }
    if (
      tasksetmode == "addhoc" ||
      tasksetmode == "newtopic" ||
      tasksetmode == "exam"
    ) {
      return Math.min(pts + income, remainsum);
    }
    if (tasksetmode == "champ") {
      return pts + income;
    } else return 0;
  } else {
    return pts;
  }
};
