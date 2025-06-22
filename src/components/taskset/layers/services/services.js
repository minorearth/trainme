import { toJS } from "mobx";
//react stuff

//
import {
  getAllTasksFromChapter,
  getRandomTasksForRepeat,
  getTextBook,
} from "@/components/taskset/layers/repository/repository";

import { getTasksRecap } from "@/components/taskset/layers/services/utils";

//

import { initials } from "@/components/Navigator/hooks/initialStates";
import { getChampTasks } from "@/components/champ/store/champVM";

//stores
import navigator from "@/components/Navigator/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";
//

import { da } from "@/components/common/dialog/dialogMacro";

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
    const tasks = await getTextBook({
      completed: userProgress.completed,
      courseid,
    });
    return { tasks, tasksuuids: [] };
  }
  if (nodemode == "renewal") {
    const { tasksuuids, tasksFetched } = await getRandomTasksForRepeat({
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
  console.log("sdsad", tasks, taskid);
  taskset.setAllTasks(tasks, taskid);
  // if (nodemode == "champ") taskset.setAllTasks(tasks, taskid);

  // if (nodemode == "addhoc" || nodemode == "newtopic")
  //   taskset.setAllTasks(tasks, taskid);

  // if (nodemode == "textbook") taskset.setAllTasks(tasks, taskid);

  // if (nodemode == "renewal") taskset.setAllTasks(tasks, taskid);
};

export const navigateToProperPage = ({ nodemode, tasknum, state }) => {
  if (nodemode == "textbook" && !tasknum) {
    da.info.textbookblocked();
    return;
  }
  navigator.updateState(state);
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

  if (nodemode == "renewal")
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
