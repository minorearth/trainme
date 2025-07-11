import { toJS } from "mobx";

import { initials } from "@/components/Navigator/layers/store/initialStates";
//utils
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

//types
import { RawTask, TasksetMode, TasksetState, TasksetStateChamp } from "@/types";

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
  tasksetmode: TasksetMode;
  chapterid: string;
  completed: boolean;
  overflow: boolean;
  remainsum: number;
  tobeunlocked: string[];
  level: number;
  tasksuuids: string[];
}

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
    return { status: "error", count: scope.length, tasks: [] };
  }
  const numbers = getNeverRepeatIntegers(scope.length - 1, num);
  const filteredTasks = scope.filter((task, id) => numbers.includes(id));
  return { status: "ok", tasks: filteredTasks, count: filteredTasks.length };
};
