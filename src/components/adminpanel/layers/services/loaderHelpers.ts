//utils
import { extractChapterIdsOnly_admin } from "@/components/course/layers/services/utils";
import { NodeDB, TaskDB } from "@/T/typesDB";
import { RawTaskToUploadWithoutLevel } from "@/T/typesUpload";

export const getChaptersIdsAndTextBookId = (chapterFlowNodes: NodeDB[]) => {
  const chapterIds = extractChapterIdsOnly_admin(chapterFlowNodes);
  return [...chapterIds, "textbook"];
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
