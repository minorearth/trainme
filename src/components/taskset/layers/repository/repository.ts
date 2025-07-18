import { getDocDataFromSubCollectionById } from "@/db/CA/firebaseCA";
import { completedChapters, TaskDB, TaskDBWraper } from "@/T/typesDB";

//ETL

export const getAllTasksFromChapter = async ({
  chapterid,
  courseid,
}: {
  chapterid: string;
  courseid: string;
}) => {
  const tasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: chapterid,
  });
  return !tasks ? [] : tasks.tasks;
};

export const getTextBookTasks = async ({
  completed,
  courseid,
}: {
  completed: completedChapters;
  courseid: string;
}) => {
  const tasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "textbook",
  });
  const unlockedTheory = tasks?.tasks.filter((task: TaskDB) =>
    completed.includes(task.chapterparentid)
  );
  if (!tasks) {
    return [];
  }
  return await unlockedTheory;
};

export const getAllCourseTasks = async (courseid: string) => {
  const allTasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "alltasks",
  });
  return allTasks?.tasks;
};
