import { getDocDataFromSubCollectionById } from "@/db/CA/firebaseCA";
import { CLT, completedChapters, TaskDB, TaskDBWraper } from "@/T/typesDB";

import S from "@/globals/settings";

export const getAllTasksFromChapter = async ({
  chapterid,
  courseid,
}: {
  chapterid: string;
  courseid: string;
}) => {
  const tasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName: CLT.newtasks,
    id: courseid,
    subCollectionName: CLT.chapters,
    subId: chapterid,
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
    collectionName: CLT.newtasks,
    id: courseid,
    subCollectionName: CLT.chapters,
    subId: S.db.TEXT_BOOK_TASKS_ID,
  });
  const unlockedTheory = tasks?.tasks.filter((task: TaskDB) =>
    completed.includes(task.chapterparentid)
  );
  if (!tasks) {
    return [];
  }
  return unlockedTheory;
};

export const getAllCourseTasks = async (courseid: string) => {
  const allTasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName: CLT.newtasks,
    id: courseid,
    subCollectionName: CLT.chapters,
    subId: S.db.ALLTASKS_DOC_ID,
  });
  return allTasks?.tasks;
};
