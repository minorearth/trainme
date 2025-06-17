import { toJS } from "mobx";
//react stuff

//
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getRandomTasksForRepeat,
} from "@/components/taskset/store/tasksetTasksVM";

import { getChampTasks } from "@/components/champ/store/champVM";
//

import { initials } from "@/components/Navigator/hooks/initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import taskset from "@/components/taskset/store/taskset";
import course from "@/components/course/store/course";
//

export const setRegularTasks = async ({
  chapterid,
  courseid,
  repeat,
  overflow,
  remainsum,
  nodemode,
  tobeunlocked,
}) => {
  const tasks = await getAllTasksFromChapter(chapterid, courseid);
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
  courseid,
  repeat,
  overflow,
  nodemode,
  level,
  remainsum,
  tobeunlocked,
}) => {
  try {
    const { tasksuuids, tasksFetched } = await getRandomTasksForRepeat({
      courseid,
      levelStart: level - 5,
      levelEnd: level,
      randomsaved: taskset.state.randomsaved,
    });
    taskset.setAllTasks(tasksFetched, initials.regularTasks.task.currTaskId);
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
    course.updateState({ courseid });
    navigator.updateState({ ...initials.regularTasks.navigator });
  } catch (e) {
    console.log(e);
    console.error("some error");
  }
};

export const setChampTasks = async ({ champid }) => {
  const tasks = await getChampTasks({
    champid,
  });
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
