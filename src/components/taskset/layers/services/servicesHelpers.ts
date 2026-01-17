import { toJS } from "mobx";

//utils
import { getNeverRepeatIntegers } from "@/tpconst/src/utils";

//types
import { TaskDB } from "@/tpconst/src/T";
import { E_CODES, throwErrorValue } from "@/tpconst/src/errorHandlers";

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
    throw throwErrorValue(
      E_CODES.NOT_ENOUGHT_TASKS_ERROR,
      scope.length.toString()
    );
  }
  const numbers = getNeverRepeatIntegers(scope.length - 1, num);
  const filteredTasks = scope.filter((task, id) => numbers.includes(id));
  return filteredTasks;
};
