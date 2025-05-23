const allChaptersToObject = (chapters) => {
  return chapters.tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.chapterid]: {
        ...acc[task.chapterid],
        [task.taskuuid]: { ...task },
      },
    }),
    {}
  );
};

export const allTasksToObject = (allTasks) => {
  return allTasks.tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.chapterid]: {
        ...acc[task.chapterid],
        [task.taskuuid]: { ...task },
      },
    }),
    {}
  );
};
