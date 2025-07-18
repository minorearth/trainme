import {
  AllCoursesRawTaskObj,
  CourseChapterObjReport,
  UserReportType,
} from "@/T/Managertypes";
import { courses } from "@/globals/coursesDB";
import { TaskLogAttrsDB, UserCoursesDB } from "@/T/typesDB";

export const getReportTree = ({
  userstat,
  chaptersobj,
  allCoursesTasks,
}: {
  userstat: UserCoursesDB;
  chaptersobj: CourseChapterObjReport;
  allCoursesTasks: AllCoursesRawTaskObj;
}) => {
  const courcesIds = Object.keys(userstat).sort(
    (a, b) => courses[a].order - courses[b].order
  );

  const res = courcesIds.map((courseId) => ({
    id: courseId,
    label: courses[courseId].title,
    order: -1,
    type: "nottask" as UserReportType,
    code: "",
    children: [
      {
        id: `${courseId}1`,
        label: "Завершенные темы",
        order: -1,
        type: "nottask" as UserReportType,
        code: "",
        children: userstat[courseId].completed.map((chapterId) => ({
          id: `${chapterId}completed`,
          label: chaptersobj[courseId][chapterId].title,
          order: -1,
          type: "nottask" as UserReportType,
          code: "",
          children: [],
        })),
      },
      {
        id: `${courseId}2`,
        label: "Статистика",
        order: -1,
        type: "nottask" as UserReportType,
        code: "",
        children: Object.keys(userstat[courseId].stat)
          .map((chapterId) => ({
            id: `${chapterId}stat`,
            label: chaptersobj[courseId][chapterId].title,
            order: chaptersobj[courseId][chapterId].order,
            type: "nottask" as UserReportType,
            code: "",
            children: userstat[courseId].stat[chapterId].tasks
              ? Object.keys(userstat[courseId].stat[chapterId].tasks)
                  .map((taskid) => ({
                    id: `${chapterId}_${taskid}`,
                    label: "Задача",
                    order: allCoursesTasks[courseId][taskid].id,
                    type: "task" as UserReportType,
                    code: prepareStatTaskCode(
                      userstat[courseId].stat[chapterId].tasks[taskid],
                      allCoursesTasks[courseId][taskid].task
                    ),
                    children: [],
                  }))
                  .sort((a, b) => a.order - b.order)
              : [],
          }))
          .sort((a, b) => a.order - b.order),
      },
    ],
  }));
  return res;
};

const prepareStatTaskCode = (task: TaskLogAttrsDB, text: string) => {
  let res = `${text}\n\n`;
  if (task.code) {
    res += `Засчитанный код:\n${task.code}`;
    res += "\n\n";
  }
  if (task.errorcode) {
    res += `Последний неправильный код:\n${task.errorcode}`;
  }
  return res;
};
