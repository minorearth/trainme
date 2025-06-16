import { toJS } from "mobx";
//react stuff

//
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getRandomTasksForRepeat,
} from "@/components/chapter/store/chapterTasksVM";

import { getChampTasks } from "@/components/champ/store/champVM";
//

import { initials } from "@/components/Navigator/hooks/initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import chapter from "@/components/chapter/store/chapter";
import flow from "@/components/course/store/course";
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
  chapter.setAllTasks(tasks, initials.regularTasks.task.currTaskId);
  chapter.updateState({
    ...initials.regularTasks.chapter,
    chapterid,
    repeat,
    overflow,
    remainsum,
    nodemode,
    tobeunlocked,
  });
  //TODO: why?
  flow.updateState({ courseid });
  navigator.updateAppState({ ...initials.regularTasks.navigator });
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
      randomsaved: chapter.state.randomsaved,
    });
    chapter.setAllTasks(tasksFetched, initials.regularTasks.task.currTaskId);
    chapter.updateState({
      ...initials.regularTasks.chapter,
      chapterid,
      repeat,
      overflow,
      nodemode,
      level,
      remainsum,
      tobeunlocked,
      randomsaved: tasksuuids,
    });
    flow.updateState({ courseid });
    navigator.updateAppState({ ...initials.regularTasks.navigator });
  } catch (e) {
    console.log(e);
    console.error("some error");
  }
};

export const setChampTasks = async ({ champid }) => {
  const tasks = await getChampTasks({
    champid,
  });
  chapter.setAllTasks(tasks.data.tasks, initials.champTasks.task.currTaskId);
  chapter.updateState({ ...initials.champTasks.chapter });
  navigator.updateAppState({ ...initials.champTasks.navigator });
};

export const setRecapTasks = (chapterState) => {
  chapter.setAllTasks(
    getTasksRecap(chapterState.state.recapTasksIds, chapterState.allTasks),
    0
  );
  chapter.updateState({ taskstage: "recap" });
};
