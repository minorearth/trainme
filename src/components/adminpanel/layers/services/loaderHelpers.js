export const getChaptersIds = (chapterFlowNodes) => {
  const chapters = chapterFlowNodes
    .map((chapter) => chapter.id)
    //excludee lottie
    .filter((id) => id[0] != "-");
  return [...chapters, "textbook"];
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
