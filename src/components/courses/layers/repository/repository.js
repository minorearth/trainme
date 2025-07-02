import { courses } from "@/globals/courses";

export const getReadyCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

export const getFreeCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

export const checkCourseReady = ({ courseid }) => {
  return getReadyCourses().includes(courseid);
};
