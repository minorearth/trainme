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
  if (unlocked.length != 0) {
    userMetaRef.update({
      rating: FieldValue.increment(pts),
      completed: FieldValue.arrayUnion(lastcompleted),
      unlocked: FieldValue.arrayUnion(...unlocked),
      lastunlocked: unlocked,
      [`stat.${lastcompleted}.sum`]: FieldValue.increment(pts),
    });
  } else {
    userMetaRef.update({
      rating: FieldValue.increment(pts),
      completed: FieldValue.arrayUnion(lastcompleted),
      [`stat.${lastcompleted}.sum`]: FieldValue.increment(pts),
    });
  }
};

export const payChapter = async (data) => {
  const firestore = getFirestore();
  const { pts, id, uid, lastunlocked } = decrypt2(data);
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    rating: FieldValue.increment(pts),
    paid: FieldValue.arrayUnion(id),
    lastunlocked,
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
    rating: 0,
    paid: [],
    stat: {},
  });
};

export const getMoney = async () => {
  const firestore = getFirestore();
  const userMetaRef = firestore
    .collection("usermeta")
    .doc("EoufdeogIZN2e02o7MulUGhnscR2");
  userMetaRef.update({
    rating: 100000,
  });
};

export const unlockAndCompleteAll = async (unlocked) => {
  const firestore = getFirestore();
  const userMetaRef = firestore
    .collection("usermeta")
    .doc("EoufdeogIZN2e02o7MulUGhnscR2");
  userMetaRef.update({
    completed: unlocked,
    unlocked,
    lastunlocked: ["4680f00b-b586-413c-890a-9669b4b7b1c3"],
    paid: [],
  });
};

export const unlockAll = async (unlocked) => {
  const firestore = getFirestore();
  const userMetaRef = firestore
    .collection("usermeta")
    .doc("EoufdeogIZN2e02o7MulUGhnscR2");
  userMetaRef.update({
    completed: [],
    unlocked,
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
