import { UserCourses, UserMeta, CourseStat } from "@/types";
import {
  UsersMetaReport,
  UserCoursesReport,
  CourseStatReport,
} from "@/components/manager/types";

export const extractDataNeededFromStat = (
  usersMeta: UserMeta[]
): UsersMetaReport => {
  const res = usersMeta.reduce(
    (acc, user) => ({
      ...acc,
      [user.userId]: getCourseChapters(user.courses),
    }),
    {}
  );
  return res;
};

const getCourseChapters = (courses: UserCourses) => {
  const res = Object.keys(courses).reduce(
    (acc, courseid) => ({
      ...acc,
      [courseid]: {
        completed: courses[courseid].completed,
        stat: getChaptersData(courses[courseid].stat),
      },
    }),
    {}
  );
  return res;
};

const getChaptersData = (chapters: CourseStat) => {
  return Object.keys(chapters).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: { sum: chapters[chapterid].sum },
    }),
    {}
  );
};
