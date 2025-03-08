import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import {
  updateDocFieldsInCollectionById,
  getDocsKeyValue,
  setDocInCollection,
  getDocDataFromCollectionById,
} from "./dataModel";

import stn from "@/globals/settings";

import { courses } from "@/globals/courses";
const freeCourses = ["6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"];

export const createNewUser = async (db, userId, name) => {
  await setDocInCollection(db, stn.collections.USER_META, {
    name,
    userId,
    paidcourses: [freeCourses[0]],
    learningstate: {
      [freeCourses[0]]: {
        rating: 0,
        lastunlocked: [courses[freeCourses[0]].firstchapter],
        unlocked: [courses[freeCourses[0]].firstchapter],
        completed: [],
        paid: [],
        stat: {},
      },
    },
  });
  return doc.id;
};
