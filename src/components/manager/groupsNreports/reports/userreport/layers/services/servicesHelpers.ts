import { URT } from "@/T/const";
import { AllCoursesRawTaskObj, UserReportType } from "@/T/Managertypes";
import { courses } from "@/globals/coursesDB";
import { CourseChapterObjDB, TaskLogAttrsDB, UserCoursesDB } from "@/T/typesDB";

import L from "@/globals/local";

export const getReportTree = ({
  userstat,
  chaptersobj,
  allCoursesTasks,
}: {
  userstat: UserCoursesDB;
  chaptersobj: CourseChapterObjDB;
  allCoursesTasks: AllCoursesRawTaskObj;
}) => {
  const courcesIds = Object.keys(userstat).sort(
    (a, b) => courses[a].order - courses[b].order
  );

  const res = courcesIds.map((courseId) => ({
    id: courseId,
    label: courses[courseId].title,
    order: -1,
    type: URT.nottask,
    code: "",
    children: [
      {
        id: `${courseId}1`,
        label: L.ru.RT.COMPLETED_CHAPTERS,
        order: -1,
        type: URT.nottask,
        code: "",
        children: userstat[courseId].completed.map((chapterId) => ({
          id: `${chapterId}completed`,
          label: chaptersobj[courseId][chapterId].title,
          order: -1,
          type: URT.task,
          code: "",
          children: [],
        })),
      },
      {
        id: `${courseId}2`,
        label: L.ru.RT.STATS,
        order: -1,
        type: URT.nottask as UserReportType,
        code: "",
        children: Object.keys(userstat[courseId].stat)
          .map((chapterId) => ({
            id: `${chapterId}stat`,
            label: chaptersobj[courseId][chapterId].title,
            order: chaptersobj[courseId][chapterId].order,
            type: URT.nottask,
            code: "",
            children: userstat[courseId].stat[chapterId].tasks
              ? Object.keys(userstat[courseId].stat[chapterId].tasks)
                  .map((taskid) => ({
                    id: `${chapterId}_${taskid}`,
                    label: L.ru.RT.TASK,
                    order: allCoursesTasks[courseId][taskid].id,
                    type: URT.task,
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
    res += `${L.ru.RT.RIGHT_CODE}\n${task.code}`;
    res += "\n\n";
  }
  if (task.errorcode) {
    res += `${L.ru.RT.ERROR_CODE}\n${task.errorcode}`;
  }
  return res;
};
