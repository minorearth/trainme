import { toJS } from "mobx";

import { updateChampPoints } from "@/components/champ/layers/repository/repository";
import splashCDStore from "@/components/common/splash/splashAction/store";
import { initials } from "@/components/Navigator/layers/store/initialStates";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import champ from "@/components/champ/layers/store/champ";
import user from "@/userlayers/store/user";
//

export const setFixed = (error) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == "recap" && !error) {
    taskset.updateStateP({ fixed: fixed ? fixed + 1 : 1 });
  }
};

export const getRemainSum = ({ stat, node }) => {
  if (!stat[node.id]?.sum) {
    return node.data.maxcoins;
  } else {
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};

export const finalizePts = ({ nodemode, pts, remainsum }) => {
  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "exam") {
    return Math.min(pts, remainsum);
  }
  return pts;
};

export const setTaskLog = ({ code, error }) => {
  const tasklog = taskset.state.tasklog;
  const taskuuid = task.currTask.taskuuid;

  const tasklogdata = !error ? { code } : { errorcode: code };
  const prevTasklogdata = Object.keys(tasklog).includes(taskuuid)
    ? tasklog[taskuuid]
    : {};
  //TODO: use object custom function
  const newChapterState = {
    ...taskset.state,
    tasklog: {
      ...tasklog,
      [taskuuid]: {
        ...prevTasklogdata,
        ...tasklogdata,
      },
    },
  };
  taskset.updateStateP(newChapterState);
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
  const { taskstage, repeat, overflow, nodemode, pts } = taskset.state;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == "WIP" && !repeat && nodemode != "exam") {
      income = 10;
    }
    if (taskstage == "WIP" && !repeat && nodemode == "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && repeat && nodemode != "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && repeat && nodemode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && !repeat && nodemode != "exam") {
      income = 2;
    }

    if (taskstage == "recap" && !repeat && nodemode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && repeat) {
      income = 1;
    }
    if (nodemode == "champ") {
      //In order to save champ points on every task execution
      updateChampPoints({
        pts: pts + income,
        champid: champ.champid,
        userid: user.userid,
      });
    }
  }
  taskset.updateStateP({ pts: pts + income });
  return pts;
};

export const ok = (action = () => {}) => {
  splashCDStore.setShow(false, "ok", 500, () => action());
};

export const getTasksetState = ({
  nodemode,
  chapterid,
  repeat,
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
      repeat,
      overflow,
      remainsum,
      nodemode,
      tobeunlocked,
    };

  if (nodemode == "exam")
    return {
      ...initials[nodemode].taskset,
      chapterid,
      repeat,
      overflow,
      nodemode,
      level,
      remainsum,
      tobeunlocked,
      randomsaved: tasksuuids,
    };
};

export const setRecapTasks = ({ tasksetState }) => {
  // da.info.recap();
  taskset.setAllTasks(
    getTasksRecap(tasksetState.state.recapTasksIds, tasksetState.allTasks),
    0
  );
  taskset.updateStateP({ taskstage: "recap" });
};
