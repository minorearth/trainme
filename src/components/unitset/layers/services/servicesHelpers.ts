import { toJS } from "mobx";

//utils
import { getNeverRepeatIntegers } from "@/tpconst/src/utils";

//types
import { TaskDB, UnitDB } from "@/tpconst/src/T";
import {
  E_CODES_DIALOG,
  throwInnerErrorCause,
} from "@/tpconst/src/errorHandlers";

export const getTasksRecap = <T>({
  recapTasksIds,
  units,
}: {
  recapTasksIds: number[];
  units: T[];
}): T[] => {
  const filteredTasks: T[] = units.filter((_: T, id: number) =>
    recapTasksIds.includes(id),
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
    (task) => task.level <= levelEnd && task.level >= levelStart,
  );
  if (scope.length < num) {
    throw throwInnerErrorCause(
      E_CODES_DIALOG.NOT_ENOUGHT_TASKS_ERROR,
      scope.length.toString(),
    );
  }
  const numbers = getNeverRepeatIntegers(scope.length - 1, num);
  const filteredTasks = scope.filter((task, id) => numbers.includes(id));
  return filteredTasks;
};
