import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import {
  updateDocFieldsInCollectionById,
  getDocsKeyValue,
  setDocInCollection,
  getDocDataFromCollectionById,
} from "./dataModel";

import stn from "@/globals/settings";

export const createNewUser = async (db, userId, name, company) => {
  await setDocInCollection(
    db,
    stn.collections.USER_META,
    { company, name, rating: 0 },
    userId
  );
  return doc.id;
};
