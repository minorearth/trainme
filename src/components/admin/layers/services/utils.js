const getChaptersLevels = (chapters) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};

//TODO: lottie animations can be in, check
export const getChaptersIds = (chapterFlowNodes) => {
  const chapters = chapterFlowNodes.map((chapter) => chapter.id);
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

export const prepareObjectModel = (chapterFlowNodes) => {
  return chapterFlowNodes
    .filter((item) => item.data.lottie == "no")
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: {
          title: item.data.title,
          maxcoins: item.data.maxcoins,
          nodemode: item.data.nodemode,
          order: item.data.order,
        },
      }),
      {}
    );
};
