//move to tpconst
//local db
import { courses } from "@/globals/coursesDB";

//courses

export const getReadyCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

export const getFreeCoursesIds = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

export const getFreeCourses = () => {
  return Object.keys(courses)
    .filter((courseId) => courses[courseId].free)
    .map((courseId) => courses[courseId]);
};

export const checkCourseReady = ({ courseid }: { courseid: string }) => {
  return getReadyCourses().includes(courseid);
};

export const getCoursesSorted = () => {
  return Object.keys(courses)
    .map((id) => ({
      ...courses[id],
      courseid: id,
    }))
    .sort((a, b) => a.order - b.order);
};
