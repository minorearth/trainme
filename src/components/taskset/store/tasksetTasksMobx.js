import { toJS } from "mobx";
//react stuff

//
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getRandomTasksForRepeat,
  getTextBook,
} from "@/components/taskset/store/tasksetTasksVM";

//

import { initials } from "@/components/Navigator/hooks/initialStates";
import { getChampTasks } from "@/components/champ/store/champVM";

//stores
import navigator from "@/components/Navigator/store/navigator";
import taskset from "@/components/taskset/store/taskset";
//

export const getTasks = async ({
  champid,
  userProgress,
  courseid,
  level,
  chapterid,
  nodemode,
}) => {
  if (nodemode == "champ") {
    const tasks = await getChampTasks({
      champid,
    });
    return { tasks, tasksuuids: [] };
  }

  if (nodemode == "textbook") {
    const tasks = await getTextBook({
      userProgress,
      courseid,
    });
    return { tasks, tasksuuids: [] };
  }
  if (nodemode == "renewal") {
    const { tasksuuids, tasksFetched } = await getRandomTasksForRepeat({
      courseid,
      levelStart: level - 5,
      levelEnd: level,
      randomsaved: taskset.state.randomsaved,
    });
    return { tasks: tasksFetched, tasksuuids };
  }
  if (nodemode == "addhoc" || nodemode == "newtopic") {
    const tasks = await getAllTasksFromChapter(chapterid, courseid);
    return { tasks, tasksuuids: [] };
  }
};

export const setRegularTasks = ({
  chapterid,
  repeat,
  overflow,
  remainsum,
  nodemode,
  tobeunlocked,
  tasks,
}) => {
  taskset.setAllTasks(tasks, initials.regularTasks.task.currTaskId);
  taskset.updateState({
    ...initials.regularTasks.taskset,
    chapterid,
    repeat,
    overflow,
    remainsum,
    nodemode,
    tobeunlocked,
  });
  navigator.updateState({ ...initials.regularTasks.navigator });
};

export const setRandomTasksToRepeat = async ({
  chapterid,
  repeat,
  overflow,
  nodemode,
  level,
  remainsum,
  tobeunlocked,
  tasks,
  tasksuuids,
}) => {
  try {
    taskset.setAllTasks(tasks, initials.regularTasks.task.currTaskId);
    taskset.updateState({
      ...initials.regularTasks.taskset,
      chapterid,
      repeat,
      overflow,
      nodemode,
      level,
      remainsum,
      tobeunlocked,
      randomsaved: tasksuuids,
    });
    navigator.updateState({ ...initials.regularTasks.navigator });
  } catch (e) {
    console.log(e);
  }
};

export const setChampTasks = async ({ tasks }) => {
  taskset.setAllTasks(tasks.data.tasks, initials.champTasks.task.currTaskId);
  taskset.updateState({ ...initials.champTasks.taskset });
  navigator.updateState({ ...initials.champTasks.navigator });
};

export const setRecapTasks = (tasksetState) => {
  taskset.setAllTasks(
    getTasksRecap(tasksetState.state.recapTasksIds, tasksetState.allTasks),
    0
  );
  taskset.updateState({ taskstage: "recap" });
};
