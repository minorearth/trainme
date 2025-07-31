import { TasksLogDB, UserMetaDB } from "tpconst/T";

export const taskLogToDBFormat = ({
  courseid,
  lastcompleted,
  tasklog,
}: {
  courseid: string;
  lastcompleted: string;
  tasklog: TasksLogDB;
}) => {
  //confirm any and as WIP
  let res: any = {};
  const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
  Object.keys(tasklog).forEach(
    (taskuuid: string) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res as UserMetaDB;
};
