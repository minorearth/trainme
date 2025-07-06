export const allTasksArrToObj = (allTasks) => {
  const alltasksObj = allTasks.data.tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.taskuuid]: { task: task.task, id: task.id },
    }),
    {}
  );

  return alltasksObj;
};

export const taskLogToDBFormat = (courseid, lastcompleted, tasklog) => {
  let res = {};
  const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
  Object.keys(tasklog).forEach(
    (taskuuid) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res;
};
