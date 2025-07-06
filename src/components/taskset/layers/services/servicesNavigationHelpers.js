import { toJS } from "mobx";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import splash from "@/components/common/splash/store";
//

export const setTaskLog = ({ code, error }) => {
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
  taskset.updateStateP({ recapTasksIds });
};

export const setRecapTasks = ({ tasksetState }) => {
  taskset.setAllTasks(
    getTasksRecap(tasksetState.state.recapTasksIds, tasksetState.allTasks),
    0
  );
  taskset.updateStateP({ taskstage: "recap" });
};

export const setTaskNumErrorFixed = (error) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == "recap" && !error) return fixed + 1;
  if (taskset.state.taskstage == "recap" && error) return fixed;
  return null;
};

export const ok = (action = () => {}) => {
  splash.setGotoplayLottie(false, "ok", () => action());
};

export const calcEarned = (error) => {
  const { taskstage, completed, overflow, nodemode, pts, remainsum } =
    taskset.state;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == "WIP" && !completed && nodemode != "exam") {
      income = 10;
    }
    if (taskstage == "WIP" && !completed && nodemode == "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && completed && nodemode != "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && completed && nodemode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && !completed && nodemode != "exam") {
      income = 2;
    }

    if (taskstage == "recap" && !completed && nodemode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && completed) {
      income = 1;
    }
    if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "exam") {
      return Math.min(pts + income, remainsum);
    }
    if (nodemode == "champ") {
      return pts + income;
    }
  } else {
    return pts;
  }
};
