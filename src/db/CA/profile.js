import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import {
  updateDocFieldsInCollectionById,
  getDocsKeyValue,
  setDocInCollection,
  getDocDataFromCollectionById,
} from "./dataModel";

import stn from "@/globals/settings";

export const createNewUser = async (db, userId, name) => {
  await setDocInCollection(
    db,
    stn.collections.USER_META,
    {
      name,
      rating: 0,
      lastunlocked: [stn.INIT_CHAPTER],
      unlocked: [stn.INIT_CHAPTER],
      completed: [],
      paid: [],
    },
    userId
  );
  return doc.id;
};
