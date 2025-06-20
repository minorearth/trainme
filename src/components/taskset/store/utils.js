import { toJS } from "mobx";

import { updateChampPoints } from "@/components/champ/store/champVM";

//stores
import task from "@/components/taskset/taskrun/store/task";
import taskset from "@/components/taskset/store/taskset";
import champ from "@/components/champ/store/champ";
//

export const setFixed = (error) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == "recap" && !error) {
    taskset.updateState({ fixed: fixed ? fixed + 1 : 1 });
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
  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "renewal") {
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
  taskset.updateState(newChapterState);
};

export const addErrorTaskToRecap = () => {
  const recapTasksIds = [...taskset.state.recapTasksIds, task.currTaskId];
  taskset.updateState({ recapTasksIds });
};

export const setEarned = (error) => {
  const { taskstage, repeat, overflow, nodemode, pts } = taskset.state;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == "WIP" && !repeat && nodemode != "renewal") {
      income = 10;
    }
    if (taskstage == "WIP" && !repeat && nodemode == "renewal") {
      income = 2;
    }
    if (taskstage == "WIP" && repeat && nodemode != "renewal") {
      income = 2;
    }
    if (taskstage == "WIP" && repeat && nodemode == "renewal") {
      income = 1;
    }

    if (taskstage == "recap" && !repeat && nodemode != "renewal") {
      income = 2;
    }

    if (taskstage == "recap" && !repeat && nodemode == "renewal") {
      income = 1;
    }

    if (taskstage == "recap" && repeat) {
      income = 1;
    }
    if (nodemode == "champ") {
      //In order to save champ points on every task execution
      updateChampPoints(income, champ.champid);
    }
  }
  taskset.updateState({ pts: pts + income });
  return pts;
};

export const extractFileNames = ({ tasks }) => {
  const files = {};
  tasks.forEach((task) => {
    task.inout.forEach((inout) => {
      inout.inv
        .filter((item) => item.includes(".txt"))
        .forEach(
          (filename) =>
            (files[filename] = {
              fileurl:
                "https://hog6lcngzkudsdma.public.blob.vercel-storage.com/a3905595-437e-47f3-b749-28ea5362bd39/d06b8c0d-4837-484a-ad85-9257e0e6af01/" +
                filename,
            })
        );
    });
  });
  return files;
};
