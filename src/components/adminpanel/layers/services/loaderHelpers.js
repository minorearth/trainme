//utils
import { extractChapterIdsOnly_admin } from "@/components/course/layers/services/utils";

export const getChaptersIdsAndTextBookId = (chapterFlowNodes) => {
  const chapterIds = extractChapterIdsOnly_admin(chapterFlowNodes);
  return [...chapterIds, "textbook"];
};

export const getChapterTasks = ({ chapterid, tasksall }) => {
  return tasksall.filter((test) => test.chapterid == chapterid);
};

export const supplyTasksWithChapterLevel = ({ tasksall, chapterFlowNodes }) => {
  const chaptersLevels = getChaptersLevels(chapterFlowNodes);
  const allTasksWithLevels = tasksall
    .filter((task) => task.tasktype == "task")
    .map((task) => {
      return { ...task, level: chaptersLevels[task.chapterparentid] };
    });

  return allTasksWithLevels;
};

const getChaptersLevels = (chapters) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};
