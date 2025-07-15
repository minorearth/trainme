"use server";
import { decrypt2 } from "./encryption";
import { db } from "./firebaseappAdmin";

export const updateDocSA = async (
  collection: string,
  dataencrypted: string
) => {
  const { data, id } = decrypt2(dataencrypted);
  const userMetaRef = db.collection(collection).doc(id);
  try {
    await userMetaRef.update(data);
    return "ok";
  } catch (error) {
    return "error";
  }
};

export const getDocSA = async (collection: string, data: { id: string }) => {
  const { id } = data;
  const userMetaRef = db.collection(collection).doc(id);
  const snapshot = await userMetaRef.get();
  return snapshot.data();
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
