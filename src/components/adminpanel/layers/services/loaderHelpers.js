//utils
import { extractChapterIdsOnly_admin } from "@/components/course/layers/services/utils";

export const getChaptersIdsAndTextBookId = (chapterFlowNodes) => {
  const chapterIds = extractChapterIdsOnly_admin(chapterFlowNodes);
  return [...chapterIds, "textbook"];
};

export const getChapterTasks = ({ chapterid, tasksall }) => {
  return tasksall.filter((test) => test.chapterid == chapterid);
};

export const supplyTasksWithChapterLevel = ({ tasks, chapterFlowNodes }) => {
  console.log("chapterFlowNodesout", chapterFlowNodes);
  const chaptersLevels = getChaptersLevels(chapterFlowNodes);
  const tasksWithLevels = tasks
    .filter((task) => task.tasktype == "task")
    .map((task) => {
      return { ...task, level: chaptersLevels[task.chapterparentid] };
    });

  return tasksWithLevels;
};

const getChaptersLevels = (chapters) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};
