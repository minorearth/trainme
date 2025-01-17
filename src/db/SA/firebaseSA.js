"use server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";
import { encrypt2, decrypt2 } from "./encryption";

await initAdmin();

export const setUseMetaData = async (data) => {
  const firestore = getFirestore();
  const { uid, pts, lastcompleted, unlocked } = decrypt2(data);
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  const { rating } = snapshot.data();
  userMetaRef.update({
    rating: rating + pts,
    completed: FieldValue.arrayUnion(lastcompleted),
    unlocked: FieldValue.arrayUnion(...unlocked),
    lastunlocked: unlocked,
  });
};

export const payChapter = async (data) => {
  const firestore = getFirestore();
  const { pts, id, uid } = decrypt2(data);
  console.log("server", decrypt2(data));
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  // const snapshot = await userMetaRef.get();
  // const { rating } = snapshot.data();
  userMetaRef.update({
    rating: FieldValue.increment(pts),
    paid: FieldValue.arrayUnion(id),
  });
};

export const resetUseMetaData = async () => {
  const firestore = getFirestore();
  const userMetaRef = firestore
    .collection("usermeta")
    .doc("EoufdeogIZN2e02o7MulUGhnscR2");
  userMetaRef.update({
    completed: [],
    unlocked: ["4680f00b-b586-413c-890a-9669b4b7b1c3"],
    lastunlocked: ["4680f00b-b586-413c-890a-9669b4b7b1c3"],
    paid: [],
  });
};

export const getUseMetaData = async (uid) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  return snapshot.data();

  // const res = await washingtonRef.update({
  //   population: FieldValue.increment(50)
  // });
  // const documents = linkSnapshot.docs.map((link) => ({
  //   test: link.data().test,
  // }));
  // return JSON.stringify(linkSnapshot.data());
  // return decrypt2(data);
};
