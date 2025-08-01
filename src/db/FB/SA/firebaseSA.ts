"use server";
import {
  DocumentData,
  FirestoreError,
  WithFieldValue,
} from "firebase/firestore";

import {
  CLT,
  decrypt2,
  throwFBError,
  UserMetaDB,
  CollectionRead,
  CollectionWrite,
  CollectonsTypes,
  DBFormats,
} from "tpconst";
import { db } from "./firebaseappAdmin";

export const updateDocSA = async <T extends DBFormats>({
  collectionName,
  dataencrypted,
}: {
  collectionName: CollectonsTypes;
  dataencrypted: string;
}) => {
  try {
    const { data, id } = decrypt2(dataencrypted);
    const res: CollectionWrite<T> = { data, collectionName, id };
    const userMetaRef = db.collection("res.collectionName").doc(res.id);
    await userMetaRef.update(data as WithFieldValue<DocumentData>);
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const getDocSA = async <T extends DBFormats>({
  collectionName,
  id,
}: CollectionRead) => {
  try {
    const userMetaRef = db.collection(collectionName).doc(id);
    const snapshot = await userMetaRef.get();
    return snapshot.data() as T;
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const checkCoursePaidSA = async (data: {
  courseid: string;
  id: string;
}) => {
  try {
    const { courseid, id } = data;
    const userMetaRef = db.collection(CLT.usermeta).doc(id);
    const snapshot = await userMetaRef.get();
    const profile = snapshot.data() as UserMetaDB;
    return profile?.paidcourses.includes(courseid);
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};
