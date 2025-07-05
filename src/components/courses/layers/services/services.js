import { getFreeCourses } from "@/components/courses/layers/repository/repository";

export const getInitalDataForFreeCourses = () => {
  const freeCourses = getFreeCourses();
  return freeCourses.reduce(
    (acc, item, id) => ({
      ...acc,
      [item]: {
        lastunlocked: [courses[freeCourses[id]].firstchapter],
        unlocked: [courses[freeCourses[id]].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {}
  );
};
