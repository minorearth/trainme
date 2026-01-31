import { RawTaskObj } from "../../../T";
import {
  completedChapters,
  CourseStatDB,
  TaskDB,
  UserCoursesDB,
  UserMetaDB,
  UsersMetaReportDB,
} from "../../../T";

export const extractUsersMetaObj = (
  usersMeta: UserMetaDB[],
): UsersMetaReportDB => {
  const res = usersMeta.reduce(
    (acc, user) => ({
      ...acc,
      [user.userId]: getCourseChapters(user.courses),
    }),
    {},
  );
  return res;
};

const getCourseChapters = (courses: UserCoursesDB) => {
  const res = Object.keys(courses).reduce(
    (acc, courseid) => ({
      ...acc,
      [courseid]: {
        completed: courses[courseid].completed as completedChapters,
        stat: getChaptersData(courses[courseid].stat),
      },
    }),
    {},
  );
  return res;
};

const getChaptersData = (chapters: CourseStatDB) => {
  return Object.keys(chapters).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: { sum: chapters[chapterid].sum },
    }),
    {},
  );
};

export const allTasksArrToObj = (units: TaskDB[]) => {
  const alltasksObj = units.reduce(
    (acc, unit) => ({
      ...acc,
      [unit.unituuid]: { task: unit.task, unitorder: unit.unitorder },
    }),
    {} as RawTaskObj,
  );

  return alltasksObj;
};
