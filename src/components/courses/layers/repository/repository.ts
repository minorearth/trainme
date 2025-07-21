import { courses } from "@/globals/coursesDB";

//api calls
import { getDataFetch } from "@/apicalls/apicalls";
import { GetDF } from "@/T/typesBasic";

export const getReadyCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

export const getFreeCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
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

export const checkCoursePaid = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  const coursePaid = await getDataFetch<boolean>({
    type: GetDF.checkcoursepaid,
    data: { courseid, id: uid },
  });
  return coursePaid;
};
