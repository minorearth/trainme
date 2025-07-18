import { getFreeCourses } from "@/components/courses/layers/repository/repository";
import { courses } from "@/globals/coursesDB";

//TODO: remade-get courses instead of ids
export const getInitalDataForFreeCourses = () => {
  const coursesDefined = courses;
  const freeCoursesIds = getFreeCourses();
  return freeCoursesIds.reduce(
    (acc, courseid, id) => ({
      ...acc,
      [courseid]: {
        lastunlocked: [coursesDefined[id].firstchapter],
        unlocked: [coursesDefined[id].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {}
  );
};
