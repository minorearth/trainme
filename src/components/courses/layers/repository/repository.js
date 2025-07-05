import { courses } from "@/globals/courses";

//api calls
import { getDataFetch } from "@/apicalls/apicalls";

export const getReadyCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

export const getFreeCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

export const checkCourseReady = ({ courseid }) => {
  return getReadyCourses().includes(courseid);
};

export const getCoursesSorted = () => {
  return Object.keys(courses)
    .map((id) => ({
      ...courses[id],
    }))
    .sort((a, b) => a.order - b.order);
};

export const checkCoursePaid = async ({ courseid, uid }) => {
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, id: uid },
  });
  return coursePaid;
};
