"use server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";
import { encrypt2, decrypt2 } from "./encryption";
import { db } from "./firebaseAdmin";

// await initAdmin();

//ADMIN ACTIONS
export const resetUseMetaData = async (lastunlocked, courseid, uid) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${courseid}`]: {
      completed: [],
      unlocked: [lastunlocked],
      lastunlocked: [lastunlocked],
      paid: [],
      stat: {},
      rating: 0,
    },
  });
};
export const getMoney = async (courseid, uid) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${courseid}.rating`]: 5000,
  });
};
export const setMoney = async (courseid, uid, money) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${courseid}.rating`]: Number(money),
  });
};
export const unlockAndCompleteAll = async (
  unlocked,
  lastunlocked,
  courseid,
  uid
) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${courseid}.completed`]: unlocked,
    [`courses.${courseid}.unlocked`]: unlocked,
    [`courses.${courseid}.lastunlocked`]: [lastunlocked],
    [`courses.${courseid}.paid`]: unlocked,
  });
};
export const unlockAll = async (unlocked, lastunlocked, courseid, uid) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${courseid}.completed`]: [],
    [`courses.${courseid}.unlocked`]: unlocked,
    [`courses.${courseid}.lastunlocked`]: [lastunlocked],
  });
};

//USER ACTIONS

// TODO:remade(later)
export const payChapter = async (data) => {
  //pts is negative here
  const { pts, id, uid, lastunlocked, courseid } = decrypt2(data);
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${courseid}.rating`]: FieldValue.increment(pts),
    [`courses.${courseid}.lastunlocked`]: [lastunlocked],
    [`courses.${courseid}.paid`]: FieldValue.arrayUnion(id),
  });
  return "ok";
};

export const getUseMetaData = async ({ uid }) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  return snapshot.data();
};

export const checkCoursePaid = async (data) => {
  const { courseid, uid } = data;
  const userMetaRef = db.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  const profile = snapshot.data();
  return profile.paidcourses.includes(courseid);
};

export const setUseMetaData = async (data) => {
  const {
    uid,
    pts,
    lastcompleted,
    unlocked,
    allunlocked,
    courseid,
    tasklog,
    sum,
    completed,
    repeat,
  } = decrypt2(data);
  const tasklogPrepared = prepareTaskLog(courseid, lastcompleted, tasklog);
  const userMetaRef = db.collection("usermeta").doc(uid);
  if (!repeat) {
    try {
      await userMetaRef.update({
        [`courses.${courseid}.completed`]: completed,
        // FieldValue.arrayUnion(lastcompleted),
        [`courses.${courseid}.rating`]: pts,
        [`courses.${courseid}.unlocked`]: allunlocked,
        [`courses.${courseid}.lastunlocked`]: unlocked,
        [`courses.${courseid}.stat.${lastcompleted}.sum`]: sum,
        ...tasklogPrepared,
      });

      return "ok";
    } catch (error) {
      return "error";
    }
  } else {
    try {
      await userMetaRef.update({
        [`courses.${courseid}.rating`]: pts,
        [`courses.${courseid}.stat.${lastcompleted}.sum`]: sum,
        ...tasklogPrepared,
      });
      return "ok";
    } catch (e) {
      return "error";
    }
  }
};

// TODO:remade(later)
export const setUseMetaUnlockedAndCompleted = async (data) => {
  const { uid, lastcompleted, unlocked, courseid } = decrypt2(data);
  const userMetaRef = db.collection("usermeta").doc(uid);
  if (unlocked.length != 0) {
    userMetaRef.update({
      [`courses.${courseid}.completed`]: FieldValue.arrayUnion(lastcompleted),
      [`courses.${courseid}.unlocked`]: FieldValue.arrayUnion(...unlocked),
      [`courses.${courseid}.lastunlocked`]: unlocked,
    });
  } else {
    userMetaRef.update({
      [`courses.${courseid}.completed`]: FieldValue.arrayUnion(lastcompleted),
    });
  }
  return "ok";
};

//UTILITIES
const prepareTaskLog = (courseid, lastcompleted, tasklog) => {
  let res = {};
  const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
  Object.keys(tasklog).forEach(
    (taskuuid) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res;
};

//LEGACY due to network cache
export const setUseMetaDataIncrement = async (data) => {
  const { uid, pts, lastcompleted, unlocked, courseid, tasklog } =
    decrypt2(data);
  const tasklogPrepared = prepareTaskLog(courseid, lastcompleted, tasklog);
  const userMetaRef = db.collection("usermeta").doc(uid);
  if (unlocked.length != 0) {
    await userMetaRef.update({
      [`courses.${courseid}.rating`]: FieldValue.increment(pts),
      [`courses.${courseid}.completed`]:
        //TODO: lastcompleted is not needed?
        FieldValue.arrayUnion(lastcompleted),
      [`courses.${courseid}.unlocked`]: FieldValue.arrayUnion(...unlocked),
      [`courses.${courseid}.lastunlocked`]: unlocked,
      [`courses.${courseid}.stat.${lastcompleted}.sum`]:
        FieldValue.increment(pts),
      ...tasklogPrepared,
    });
  } else {
    userMetaRef.update({
      [`courses.${courseid}.rating`]: FieldValue.increment(pts),
      // [`courses.${courseid}.completed`]:
      //   FieldValue.arrayUnion(lastcompleted),
      [`courses.${courseid}.stat.${lastcompleted}.sum`]:
        FieldValue.increment(pts),
      ...tasklogPrepared,
    });
  }
};
