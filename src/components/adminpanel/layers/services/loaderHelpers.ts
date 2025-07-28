//utils
//TODO:crerate repository for upload courses
import { extractChapterIdsOnly_admin } from "@/repository/ETL/ETLadmin";
import { NodeDB, TaskDB } from "tpconst/T";
import { RawTaskToUploadWithoutLevel } from "tpconst/T";
import S from "@/globals/settings";

export const getChaptersIdsAndTextBookId = (chapterFlowNodes: NodeDB[]) => {
  const chapterIds = extractChapterIdsOnly_admin(chapterFlowNodes);
  return [...chapterIds, S.db.TEXT_BOOK_TASKS_ID];
};

export const getChapterTasks = ({
  chapterid,
  tasksall,
}: {
  chapterid: string;
  tasksall: RawTaskToUploadWithoutLevel[];
}) => {
  return tasksall.filter((test) => test.chapterid == chapterid);
};

export const supplyTasksWithChapterLevel = ({
  tasks,
  chapterFlowNodes,
}: {
  tasks: RawTaskToUploadWithoutLevel[];
  chapterFlowNodes: NodeDB[];
}) => {
  const chaptersLevels: { [chapterid: string]: number } =
    getChaptersLevels(chapterFlowNodes);
  const tasksWithLevels = tasks.map((task) => {
    return { ...task, level: chaptersLevels[task.chapterparentid] };
  });

  return tasksWithLevels as TaskDB[];
};

const getChaptersLevels = (chapters: NodeDB[]) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};
