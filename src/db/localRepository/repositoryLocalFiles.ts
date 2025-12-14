//move to tpconst
//local db
import { courses } from "@/globals/coursesDB";
import { CoursesDB } from "tpconst/T";
import { CoursesDBObj } from "tpconst/T";

//courses

//TODO: intruduce typescript for paraameeterless funcs

export const getReadyCoursesIds = (): string[] => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

export const getFreeCoursesIds = (): string[] => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

//TODO: Koroleva sample
export const getFreeCourses = (): CoursesDBObj => {
  const res = Object.keys(courses)
    .filter((courseId) => courses[courseId].free)
    .reduce((acc, courseId) => ({ ...acc, [courseId]: courses[courseId] }), {});
  return res;
  // return Object.keys(courses)
  //   .filter((courseId) => courses[courseId].free)
  //   .map((courseId) => courses[courseId]);
};

export const checkCourseReady = ({
  courseid,
}: {
  courseid: string;
}): boolean => {
  return getReadyCoursesIds().includes(courseid);
};

export const getCoursesSorted = (): CoursesDB[] => {
  return Object.keys(courses)
    .map((id) => ({
      ...courses[id],
      courseid: id,
    }))
    .sort((a, b) => a.order - b.order);
};
