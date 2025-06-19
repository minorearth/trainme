import { getDocDataFromSubCollectionByIdClient } from "@/db/domain/domain";
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

export const getAllTasksFromChapter = async (chapterid, courseid) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    chapterid
  );
  return !tasks.data ? [] : tasks.data.tasks;
};

export const getTextBook = async ({ userProgress, courseid }) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "textbook"
  );
  const unlockedTheory = tasks.data.tasks.filter((item) =>
    userProgress.completed.includes(item.chapterparentid)
  );
  if (!tasks.data) {
    return [];
  }
  return unlockedTheory;
};

export const getRandomTasks = (allTasks, levelStart, levelEnd, num) => {
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

export const getRandomTasksForRepeat = async ({
  courseid,
  levelStart,
  levelEnd,
  randomsaved,
}) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );

  if (randomsaved && randomsaved?.length != 0) {
    const filteredTasks = allTasks.data.tasks.filter((task) =>
      randomsaved.includes(task.taskuuid)
    );
    const tasksuuids = randomsaved;
    return { tasksuuids, tasksFetched: filteredTasks };
  } else {
    const filteredTasks = getRandomTasks(
      allTasks.data.tasks,
      levelStart,
      levelEnd,
      5
    );

    const tasksuuids = filteredTasks.data.map((task) => task.taskuuid);
    return { tasksuuids, tasksFetched: filteredTasks.data };
  }
};

export const getTasksRecap = (recapTasksIds, tasks) => {
  const filteredTasks = tasks.filter((test, id) => recapTasksIds.includes(id));
  return filteredTasks;
};
