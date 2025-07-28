import { toJS } from "mobx";

//utils
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

//types
import { Task } from "tpconst/T";
import { TaskDB } from "tpconst/T";
import E from "@/globals/errorMessages";
import L from "@/globals/local";

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

export const getRandomTasks = ({
  allTasks,
  levelStart,
  levelEnd,
  num,
}: {
  allTasks: TaskDB[];
  levelStart: number;
  levelEnd: number;
  num: number;
}) => {
  const scope = allTasks.filter(
    (task) => task.level <= levelEnd && task.level >= levelStart
  );
  if (scope.length < num) {
    throw new Error(E.NOT_ENOUGHT_TASKS_ERROR, {
      cause: { count: scope.length },
    });
  }
  const numbers = getNeverRepeatIntegers(scope.length - 1, num);
  const filteredTasks = scope.filter((task, id) => numbers.includes(id));
  return filteredTasks;
};
