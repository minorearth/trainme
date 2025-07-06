import { getDocDataFromSubCollectionByIdClient } from "@/db/CA/interface";

//ETL
import { allTasksArrToObj } from "@/components/taskset/layers/repository/ETL";

export const getAllTasksFromChapter = async (chapterid, courseid) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    chapterid
  );
  return !tasks.data ? [] : tasks.data.tasks;
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
  return await unlockedTheory;
};

export const getAllCourseTasks = async (courseid) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );
  return allTasks.data.tasks;
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
