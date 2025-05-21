import { setDocInCollection } from "./dataModel";

import stn from "@/globals/settings";

import { courses, getFreeCourses } from "@/globals/courses";

const getInitalDataForFreeCourses = (freeCourses) => {
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

export const createNewUser = async (db, userId, name) => {
  const freeCourses = getFreeCourses();
  const data = {
    name,
    userId,
    paidcourses: freeCourses,
    courses: getInitalDataForFreeCourses(freeCourses),
  };
  await setDocInCollection(db, stn.collections.USER_META, data, userId);
};
