"use server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";
import { encrypt2, decrypt2 } from "./encryption";

await initAdmin();

const admin = "EoufdeogIZN2e02o7MulUGhnscR2";

export const payChapter = async (data) => {
  const firestore = getFirestore();
  const { pts, id, uid, lastunlocked, launchedCourse } = decrypt2(data);
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.rating`]: FieldValue.increment(pts),
    [`courses.${launchedCourse}.lastunlocked`]: [lastunlocked],
    [`courses.${launchedCourse}.paid`]: FieldValue.arrayUnion(id),
  });
};

export const resetUseMetaData = async (lastunlocked, launchedCourse, uid) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}`]: {
      completed: [],
      unlocked: [lastunlocked],
      lastunlocked: [lastunlocked],
      paid: [],
      stat: {},
      rating: 0,
    },
  });
};

export const getMoney = async (launchedCourse, uid) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.rating`]: 5000,
  });
};
export const setMoney = async (launchedCourse, uid, money) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.rating`]: Number(money),
  });
};

export const unlockAndCompleteAll = async (
  unlocked,
  lastunlocked,
  launchedCourse,
  uid
) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.completed`]: unlocked,
    [`courses.${launchedCourse}.unlocked`]: unlocked,
    [`courses.${launchedCourse}.lastunlocked`]: [lastunlocked],
    [`courses.${launchedCourse}.paid`]: unlocked,
  });
};

export const unlockAll = async (
  unlocked,
  lastunlocked,
  launchedCourse,
  uid
) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.completed`]: [],
    [`courses.${launchedCourse}.unlocked`]: unlocked,
    [`courses.${launchedCourse}.lastunlocked`]: [lastunlocked],
  });
};

export const getUseMetaData = async (uid) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  return snapshot.data();
};

export const checkCoursePaid = async (courseid, uid) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  const profile = snapshot.data();
  return profile.paidcourses.includes(courseid);
};

const prepareTaskLog = (launchedCourse, lastcompleted, tasklog) => {
  let res = {};
  const dest = `courses.${launchedCourse}.stat.${lastcompleted}`;
  Object.keys(tasklog).forEach(
    (taskuuid) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res;
};

export const setUseMetaData = async (data) => {
  const firestore = getFirestore();
  const { uid, pts, lastcompleted, unlocked, launchedCourse, tasklog } =
    decrypt2(data);
  const tasklogPrepared = prepareTaskLog(
    launchedCourse,
    lastcompleted,
    tasklog
  );
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  if (unlocked.length != 0) {
    userMetaRef.update({
      [`courses.${launchedCourse}.rating`]: FieldValue.increment(pts),
      [`courses.${launchedCourse}.completed`]:
        //TODO: lastcompleted is not needed?
        FieldValue.arrayUnion(lastcompleted),
      [`courses.${launchedCourse}.unlocked`]: FieldValue.arrayUnion(
        ...unlocked
      ),
      [`courses.${launchedCourse}.lastunlocked`]: unlocked,
      [`courses.${launchedCourse}.stat.${lastcompleted}.sum`]:
        FieldValue.increment(pts),
      ...tasklogPrepared,
    });
  } else {
    userMetaRef.update({
      [`courses.${launchedCourse}.rating`]: FieldValue.increment(pts),
      // [`courses.${launchedCourse}.completed`]:
      //   FieldValue.arrayUnion(lastcompleted),
      [`courses.${launchedCourse}.stat.${lastcompleted}.sum`]:
        FieldValue.increment(pts),
      ...tasklogPrepared,
    });
  }
};

export const setUseMetaUnlockedAndCompleted = async (data) => {
  const firestore = getFirestore();
  const { uid, lastcompleted, unlocked, launchedCourse } = decrypt2(data);
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  if (unlocked.length != 0) {
    userMetaRef.update({
      [`courses.${launchedCourse}.completed`]:
        FieldValue.arrayUnion(lastcompleted),
      [`courses.${launchedCourse}.unlocked`]: FieldValue.arrayUnion(
        ...unlocked
      ),
      [`courses.${launchedCourse}.lastunlocked`]: unlocked,
    });
  } else {
    userMetaRef.update({
      [`courses.${launchedCourse}.completed`]:
        FieldValue.arrayUnion(lastcompleted),
    });
  }
};
