import { toJS } from "mobx";

import { initials } from "@/components/Navigator/layers/store/initialStates";
//utils
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

export const getTasksRecap = (recapTasksIds, tasks) => {
  const filteredTasks = tasks.filter((test, id) => recapTasksIds.includes(id));
  return filteredTasks;
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

export const getRandomTasks = ({ allTasks, levelStart, levelEnd, num }) => {
  const scope = allTasks.filter(
    (task) => task.level <= levelEnd && task.level >= levelStart
  );
  if (scope.length < num) {
    return { status: "error", count: scope.length, data: [] };
  }
  const numbers = getNeverRepeatIntegers(scope.length - 1, num);
  const filteredTasks = scope.filter((task, id) => numbers.includes(id));
  return { status: "ok", data: filteredTasks, count: filteredTasks.length };
};
