"use server";
import { DocumentData, WithFieldValue } from "firebase/firestore";
import { decrypt2 } from "@/globals/utils/encryption";

import { db } from "./firebaseappAdmin";
import {
  CLT,
  CollectionRead,
  CollectionWrite,
  CollectonsTypes,
  DBFormats,
} from "@/T/typesDB";
import { throwFBError } from "@/globals/errorMessages";
import { FirebaseError } from "@firebase/util";

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
  } catch (error: unknown) {
    throw throwFBError(error);
  }
};

export const getDocSA = async <T extends DBFormats>({
  collectionName,
  id,
}: CollectionRead) => {
  const userMetaRef = db.collection(collectionName).doc(id);
  const snapshot = await userMetaRef.get();
  return snapshot.data() as T;
};

export const checkCoursePaidSA = async (data: {
  courseid: string;
  id: string;
}) => {
  const { courseid, id } = data;
  const userMetaRef = db.collection(CLT.usermeta).doc(id);
  const snapshot = await userMetaRef.get();
  const profile = snapshot.data();
  return profile?.paidcourses.includes(courseid);
};
