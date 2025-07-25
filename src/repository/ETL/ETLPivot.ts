import { RawTaskObj } from "@/T/Managertypes";
import {
  completedChapters,
  CourseStatDB,
  TaskDB,
  UserCoursesDB,
  UserMetaDB,
  UsersMetaReportDB,
} from "@/T/typesDB";

export const extractUsersMetaObj = (
  usersMeta: UserMetaDB[]
): UsersMetaReportDB => {
  const res = usersMeta.reduce(
    (acc, user) => ({
      ...acc,
      [user.userId]: getCourseChapters(user.courses),
    }),
    {}
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
    {}
  );
  return res;
};

const getChaptersData = (chapters: CourseStatDB) => {
  return Object.keys(chapters).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: { sum: chapters[chapterid].sum },
    }),
    {}
  );
};

export const allTasksArrToObj = (tasks: TaskDB[]): RawTaskObj => {
  const alltasksObj = tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.taskuuid]: { task: task.task, id: task.id },
    }),
    {}
  );

  return alltasksObj;
};
