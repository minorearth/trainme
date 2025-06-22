import { getDocDataFromSubCollectionByIdClient } from "@/db/domain/domain";
import { getRandomTasks } from "@/components/taskset/layers/repository/utils";
import { ETL } from "@/components/taskset/layers/repository/ETL";

export const getAllTasksFromChapter = async (chapterid, courseid) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    chapterid
  );
  return !tasks.data ? [] : await ETL(tasks.data.tasks);
};

export const getTextBook = async ({ completed, courseid }) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "textbook"
  );
  const unlockedTheory = tasks.data.tasks.filter((item) =>
    completed.includes(item.chapterparentid)
  );
  if (!tasks.data) {
    return [];
  }
  return await ETL(unlockedTheory);
};

export const getRandomTasksForChamp = async ({
  levelStart,
  levelEnd,
  taskCount,
  courseid,
}) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );

  const filteredTasks = getRandomTasks({
    allTasks: allTasks.data.tasks,
    levelStart,
    levelEnd,
    num: taskCount,
  });

  return await ETL(filteredTasks.data);
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
    console.log("filteredTasks", filteredTasks);
    return { tasksuuids, tasksFetched: await ETL(filteredTasks) };
  } else {
    const filteredTasks = getRandomTasks({
      allTasks: allTasks.data.tasks,
      levelStart,
      levelEnd,
      num: 5,
    });

    const tasksuuids = filteredTasks.data.map((task) => task.taskuuid);
    return { tasksuuids, tasksFetched: await ETL(filteredTasks.data) };
  }
};
