import { toJS } from "mobx";

//utils
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

//types
import { Task } from "@/T/typesState";
import { TaskDB } from "@/T/typesDB";

export const getTasksRecap = <T>({
  recapTasksIds,
  tasks,
}: {
  recapTasksIds: number[];
  tasks: T[];
}): T[] => {
  const filteredTasks: T[] = tasks.filter((_: T, id: number) =>
    recapTasksIds.includes(id)
  );
  return filteredTasks;
};

interface getRandomTasksParams {
  allTasks: TaskDB[];
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
