import { getFreeCourses } from "@/db/repository/repositoryLocalFiles";

export const getInitalDataForFreeCourses = () => {
  const freeCourses = getFreeCourses();
  return Object.keys(freeCourses).reduce(
    (acc, courseid, id) => ({
      ...acc,
      [courseid]: {
        lastunlocked: [freeCourses[id].firstchapter],
        unlocked: [freeCourses[id].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {}
  );
};
