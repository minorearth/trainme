import { getDocDataFromSubCollectionByIdClient } from "@/db/CA/interface";
import { getRandomTasks } from "@/components/taskset/layers/services/servicesHelpers";
import {
  ETL,
  allTasksArrToObj,
} from "@/components/taskset/layers/services/ETL";

export const getAllTasksFromChapter = async (chapterid, courseid) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    chapterid
  );
  //TODO: movee all ETLS after filter
  return !tasks.data ? [] : await ETL(tasks.data.tasks);
};

export const getTextBookTasks = async ({ completed, courseid }) => {
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

export const getAllCourseTasks = async (courseid) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );
  return await ETL(allTasks.data.tasks);
};

export const getAllTasksDataObj = async (courseid) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );
  return allTasksArrToObj(allTasks);
};
