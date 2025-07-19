import { getFreeCourses } from "@/components/courses/layers/repository/repository";
import { courses } from "@/globals/coursesDB";

export const getInitalDataForFreeCourses = () => {
  const freeCoursesIds = getFreeCourses();
  return freeCoursesIds.reduce(
    (acc, courseid, id) => ({
      ...acc,
      [courseid]: {
        lastunlocked: [courses[id].firstchapter],
        unlocked: [courses[id].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {}
  );
};
