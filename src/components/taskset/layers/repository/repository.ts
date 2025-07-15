import { getDocDataFromSubCollectionByIdClient } from "@/db/CA/interface";

//ETL
import { allTasksArrToObj } from "@/components/taskset/layers/repository/ETL";
import { RawTask } from "@/types";

export const getAllTasksFromChapter = async ({
  chapterid,
  courseid,
}: {
  chapterid: string;
  courseid: string;
}) => {
  const tasks = await getDocDataFromSubCollectionByIdClient({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: chapterid,
  });
  return !tasks.data ? [] : tasks.data.tasks;
};

export const getTextBookTasks = async ({
  completed,
  courseid,
}: {
  completed: string[];
  courseid: string;
}) => {
  const tasks = await getDocDataFromSubCollectionByIdClient({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "textbook",
  });
  const unlockedTheory = tasks.data?.tasks.filter((task: RawTask) =>
    completed.includes(task.chapterparentid)
  );
  if (!tasks.data) {
    return [];
  }
  return await unlockedTheory;
};

export const getAllCourseTasks = async (courseid: string) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "alltasks",
  });
  return allTasks.data?.tasks;
};

export const getAllTasksDataObj = async (courseid: string) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "alltasks",
  });
  return allTasksArrToObj(allTasks.data?.tasks);
};
