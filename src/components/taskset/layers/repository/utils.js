import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

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
