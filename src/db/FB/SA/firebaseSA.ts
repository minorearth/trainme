"use server";
import {
  DocumentData,
  FirestoreError,
  WithFieldValue,
} from "firebase/firestore";
import { decrypt2 } from "@/globals/utils/encryption";

import { db } from "./firebaseappAdmin";
import {
  CollectionRead,
  CollectionWrite,
  // CollectionWrite,
  CollectonsTypes,
  DBFormats,
  UserMetaDB,
} from "tpconst/T";

import { CLT } from "tpconst/constants";
import { throwFBError } from "@/globals/errorsHandling/errorHandlers";

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
