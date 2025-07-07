import { toJS } from "mobx";

import { initials } from "@/components/Navigator/layers/store/initialStates";
//utils
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

//types
import { RawTask, Nodemode } from "@/types";

interface GetTasksRecapParams {
  recapTasksIds: number[];
  tasks: RawTask[];
}

export const getTasksRecap = ({
  recapTasksIds,
  tasks,
}: GetTasksRecapParams): RawTask[] => {
  const filteredTasks = tasks.filter((_: any, id: number) =>
    recapTasksIds.includes(id)
  );
  return filteredTasks;
};

interface getTasksetParams {
  nodemode: Nodemode;
  chapterid: string;
  completed: boolean;
  overflow: boolean;
  remainsum: number;
  tobeunlocked: string[];
  level: number;
  tasksuuids: string[];
}

export const getTasksetState = ({
  nodemode,
  chapterid,
  completed,
  overflow,
  remainsum,
  tobeunlocked,
  level,
  tasksuuids,
}: getTasksetParams) => {
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

interface getRandomTasksParams {
  allTasks: RawTask[];
  levelStart: number;
  levelEnd: number;
  num: number;
}

export const getRandomTasks = ({
  allTasks,
  levelStart,
  levelEnd,
  num,
}: getRandomTasksParams) => {
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
