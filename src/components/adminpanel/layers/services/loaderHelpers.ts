//utils
import { extractChapterIdsOnly_admin } from "@/components/course/layers/services/utils";
import { Node, RawTask, Task, TaskToUpload } from "@/types";

export const getChaptersIdsAndTextBookId = (chapterFlowNodes: Node[]) => {
  const chapterIds = extractChapterIdsOnly_admin(chapterFlowNodes);
  return [...chapterIds, "textbook"];
};

export const getChapterTasks = ({
  chapterid,
  tasksall,
}: {
  chapterid: string;
  tasksall: TaskToUpload[];
}) => {
  return tasksall.filter((test) => test.chapterid == chapterid);
};

export const supplyTasksWithChapterLevel = ({
  tasks,
  chapterFlowNodes,
}: {
  tasks: TaskToUpload[];
  chapterFlowNodes: Node[];
}) => {
  const chaptersLevels: { [chapterid: string]: number } =
    getChaptersLevels(chapterFlowNodes);
  const tasksWithLevels = tasks
    // .filter((task) => task.tasktype == "task")
    .map((task) => {
      return { ...task, level: chaptersLevels[task.chapterparentid] };
    });

  return tasksWithLevels;
};

const getChaptersLevels = (chapters: Node[]) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};
