"use server";
import { DocumentData, WithFieldValue } from "firebase/firestore";
import { decrypt2 } from "@/globals/utils/encryption";

import { db } from "./firebaseappAdmin";

export const updateDocSA = async <T>(
  collection: string,
  dataencrypted: string
) => {
  const { data, id }: { data: T; id: string } = decrypt2(dataencrypted);
  const userMetaRef = db.collection(collection).doc(id);
  try {
    await userMetaRef.update(data as WithFieldValue<DocumentData>);
    return "ok";
  } catch (error) {
    return "error";
  }
};

export const getDocSA = async <T>(collection: string, data: { id: string }) => {
  const { id } = data;
  const userMetaRef = db.collection(collection).doc(id);
  const snapshot = await userMetaRef.get();
  return snapshot.data() as T;
};

export const checkCoursePaidSA = async (data: {
  courseid: string;
  id: string;
}) => {
  const { courseid, id } = data;
  const userMetaRef = db.collection("usermeta").doc(id);
  const snapshot = await userMetaRef.get();
  const profile = snapshot.data();
  return profile?.paidcourses.includes(courseid);
};
