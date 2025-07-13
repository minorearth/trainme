import { CourseChapterObjReport } from "@/components/manager/types";
import { courses } from "@/globals/courses";
import {
  AllCoursesRawTaskObj,
  Task,
  TaskStatAttrs,
  UserCourses,
} from "@/types";

export const getReportTree = ({
  userstat,
  chaptersobj,
  allCoursesTasks,
}: {
  userstat: UserCourses;
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
    type: "nottask",
    code: "",
    children: [
      {
        id: `${courseId}1`,
        label: "Завершенные темы",
        order: -1,
        type: "nottask",
        code: "",
        children: userstat[courseId].completed.map((chapterId) => ({
          id: `${chapterId}completed`,
          label: chaptersobj[courseId][chapterId].title,
          order: -1,
          type: "nottask",
          code: "",
          children: [],
        })),
      },
      {
        id: `${courseId}2`,
        label: "Статистика",
        order: -1,
        type: "nottask",
        code: "",
        children: Object.keys(userstat[courseId].stat)
          .map((chapterId) => ({
            id: `${chapterId}stat`,
            label: chaptersobj[courseId][chapterId].title,
            order: chaptersobj[courseId][chapterId].order,
            type: "nottask",
            code: "",
            children: userstat[courseId].stat[chapterId].tasks
              ? Object.keys(userstat[courseId].stat[chapterId].tasks)
                  .map((taskid) => ({
                    id: `${chapterId}_${taskid}`,
                    label: "Задача",
                    order: allCoursesTasks[courseId][taskid].id,
                    type: "task",
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

const prepareStatTaskCode = (task: TaskStatAttrs, text: string) => {
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
