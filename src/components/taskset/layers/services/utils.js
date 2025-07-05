import { toJS } from "mobx";

import { updateChampPoints } from "@/components/champ/layers/repository/repository";
import { initials } from "@/components/Navigator/layers/store/initialStates";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import champ from "@/components/champ/layers/store/champ";
import user from "@/userlayers/store/user";
import splash from "@/components/common/splash/store";
//

export const setTaskNumErrorFixed = (error) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == "recap" && !error) return fixed + 1;
  if (taskset.state.taskstage == "recap" && error) return fixed;
  return null;
};

export const getRemainSum = ({ stat, node }) => {
  if (!stat[node.id]?.sum) {
    return node.data.maxcoins;
  } else {
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};

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

export const getTasksRecap = (recapTasksIds, tasks) => {
  const filteredTasks = tasks.filter((test, id) => recapTasksIds.includes(id));
  return filteredTasks;
};

export const setEarned = (error) => {
  const { taskstage, completed, overflow, nodemode, pts, remainsum } =
    taskset.state;
  let income = 0;
  console.log();
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
      //In order to save champ points on every task execution
      updateChampPoints({
        pts: pts + income,
        champid: champ.champid,
        userid: user.userid,
      });
      return pts + income;
    }
  } else {
    return pts;
  }
};

export const ok = (action = () => {}) => {
  splash.setGotoplayLottie(false, "ok", () => action());
};

export const getTasksetState = ({
  nodemode,
  chapterid,
  completed,
  overflow,
  remainsum,
  tobeunlocked,
  level,
  tasksuuids,
}) => {
  if (nodemode == "champ" || nodemode == "textbook") {
    return { ...initials[nodemode].taskset, nodemode };
  }

  if (nodemode == "addhoc" || nodemode == "newtopic")
    return {
      ...initials[nodemode].taskset,
      chapterid,
      completed,
      overflow,
      remainsum,
      nodemode,
      tobeunlocked,
    };

  if (nodemode == "exam")
    return {
      ...initials[nodemode].taskset,
      chapterid,
      completed,
      overflow,
      nodemode,
      level,
      remainsum,
      tobeunlocked,
      randomsaved: tasksuuids,
    };
};

export const setRecapTasks = ({ tasksetState }) => {
  taskset.setAllTasks(
    getTasksRecap(tasksetState.state.recapTasksIds, tasksetState.allTasks),
    0
  );
  taskset.updateStateP({ taskstage: "recap" });
};
