import { RawTask, RawTaskObj, UserMeta } from "@/types";

export const allTasksArrToObj = (tasks: RawTask[]): RawTaskObj => {
  const alltasksObj = tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.taskuuid]: { task: task.task, id: task.id },
    }),
    {}
  );

  return alltasksObj;
};

//TODO: tasklog typed
export const taskLogToDBFormat = ({
  courseid,
  lastcompleted,
  tasklog,
}: {
  courseid: string;
  lastcompleted: string;
  tasklog: any;
}) => {
  let res: any = {};
  const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
  Object.keys(tasklog).forEach(
    (taskuuid: string) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res as UserMeta;
};
