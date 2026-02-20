//move to tpconst
//local db
import { courses } from "@/globals/coursesDB";
import { CoursesDB } from "@/tpconst/src/T";
import { CoursesDBObj } from "@/tpconst/src/T";

//courses

//TODO: intruduce typescript for paraameeterless funcs

export const getReadyCoursesIds = (): string[] => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

//TODO: Koroleva sample

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
