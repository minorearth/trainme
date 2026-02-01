import { TasksLogDB, UserMetaDB } from "../../../T";

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
    (unituuid: string) => (res[`${dest}.${unituuid}`] = tasklog[unituuid]),
  );
  return res as UserMetaDB;
};
