import { courses } from "@/globals/courses";

export const getReportTree = (userstat, chaptersobj, allCoursesTasks) => {
  //TODO(later): sort courses
  const res = Object.keys(userstat).map((courseId) => ({
    id: courseId,
    label: courses[courseId].title,
    children: [
      {
        id: `${courseId}1`,
        label: "Завершенные темы",
        children: userstat[courseId].completed.map((chapterId) => ({
          id: `${chapterId}completed`,
          label: chaptersobj[courseId][chapterId].title,
        })),
      },
      {
        id: `${courseId}2`,
        label: "Статистика",
        children: Object.keys(userstat[courseId].stat)
          .map((chapterId) => ({
            id: `${chapterId}stat`,
            label: chaptersobj[courseId][chapterId].title,
            order: chaptersobj[courseId][chapterId].order,
            children: userstat[courseId].stat[chapterId].tasks
              ? Object.keys(userstat[courseId].stat[chapterId].tasks)
                  .map((taskid) => ({
                    id: `${chapterId}_${taskid}`,
                    label: "Задача",
                    order: allCoursesTasks[courseId][taskid].id,
                    code: prepareStatTaskCode(
                      userstat[courseId].stat[chapterId].tasks[taskid],
                      allCoursesTasks[courseId][taskid].task
                    ),
                    type: "task",
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

const prepareStatTaskCode = (task, text) => {
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
