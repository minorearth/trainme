import { getFreeCourses } from "@/db/localRepository/repositoryLocalFiles";
import { UserCoursesDB } from "tpconst/T";

//TODO: assign type to all reducers ex. {} as UserCoursesDB
export const getInitalDataForFreeCourses = (): UserCoursesDB => {
  const freeCourses = getFreeCourses();

  return Object.keys(freeCourses).reduce(
    (acc, courseid) => ({
      ...acc,
      [courseid]: {
        lastunlocked: [freeCourses[courseid].firstchapter],
        unlocked: [freeCourses[courseid].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {} as UserCoursesDB
  );
};
