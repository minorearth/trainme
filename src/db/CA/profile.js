import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import {
  updateDocFieldsInCollectionById,
  getDocsKeyValue,
  setDocInCollection,
  getDocDataFromCollectionById,
} from "./dataModel";

import stn from "@/globals/settings";

import { courses } from "@/globals/courses";
const freeCourses = [
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
  "a3905595-437e-47f3-b749-28ea5362bd39",
];

const getFreeCourses = () => {
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
  const data = {
    name,
    userId,
    paidcourses: freeCourses,
    courses: getFreeCourses(),
  };
  await setDocInCollection(db, stn.collections.USER_META, data, userId);
  return doc.id;
};
