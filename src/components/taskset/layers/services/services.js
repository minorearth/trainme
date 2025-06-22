import { toJS } from "mobx";

//
import {
  getAllTasksFromChapter,
  getRandomTasksForRenewal,
  getTextBookTasks,
} from "@/components/taskset/layers/repository/repository";

import {
  getTasksRecap,
  getTasksetState,
} from "@/components/taskset/layers/services/utils";
//

import { getChampTasks } from "@/components/champ/store/champVM";

//stores
import taskset from "@/components/taskset/layers/store/taskset";
//

export const getTasks = async ({
  champid,
  userProgress,
  courseid,
  level,
  chapterid,
  nodemode,
  recapTasksIds = [],
  taskstage = "",
  randomsaved,
}) => {
  if (nodemode == "champ") {
    const tasks = await getChampTasks({
      champid,
    });
    if (taskstage == "recap" || taskstage == "recap_suspended") {
      const recapTasks = getTasksRecap(recapTasksIds, tasks.data.tasks);
      return { tasks: recapTasks, tasksuuids: recapTasksIds };
    } else return { tasks: tasks.data.tasks, tasksuuids: [] };
  }

  if (nodemode == "textbook") {
    const tasks = await getTextBookTasks({
      completed: userProgress.completed,
      courseid,
    });
    return { tasks, tasksuuids: [] };
  }
  if (nodemode == "renewal") {
    const { tasksuuids, tasksFetched } = await getRandomTasksForRenewal({
      courseid,
      levelStart: level - 5,
      levelEnd: level,
      randomsaved,
    });
    return { tasks: tasksFetched, tasksuuids };
  }
  if (nodemode == "addhoc" || nodemode == "newtopic") {
    const tasks = await getAllTasksFromChapter(chapterid, courseid);
    if (taskstage == "recap" || taskstage == "recap_suspended") {
      const recapTasks = getTasksRecap(recapTasksIds, tasks);
      return { tasks: recapTasks, tasksuuids: recapTasksIds };
    } else return { tasks, tasksuuids: [] };
  }
};

export const setTasks = ({ tasks, taskid }) => {
  taskset.setAllTasks(tasks, taskid);
};

export const updateTasksetState = (props) => {
  const taskSetState = getTasksetState({
    ...props,
  });

  taskset.updateState(taskSetState);
};
