"use server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";
import { encrypt2, decrypt2 } from "./encryption";
import { db } from "./firebaseAdmin";

// await initAdmin();

//ADMIN ACTIONS
export const resetUseMetaData = async (lastunlocked, launchedCourse, uid) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
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
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.rating`]: 5000,
  });
};
export const setMoney = async (launchedCourse, uid, money) => {
  const userMetaRef = db.collection("usermeta").doc(uid);
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
  const userMetaRef = db.collection("usermeta").doc(uid);
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
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.completed`]: [],
    [`courses.${launchedCourse}.unlocked`]: unlocked,
    [`courses.${launchedCourse}.lastunlocked`]: [lastunlocked],
  });
};

//USER ACTIONS

// TODO:remade
export const payChapter = async (data) => {
  const { pts, id, uid, lastunlocked, launchedCourse } = decrypt2(data);
  const userMetaRef = db.collection("usermeta").doc(uid);
  userMetaRef.update({
    [`courses.${launchedCourse}.rating`]: FieldValue.increment(pts),
    [`courses.${launchedCourse}.lastunlocked`]: [lastunlocked],
    [`courses.${launchedCourse}.paid`]: FieldValue.arrayUnion(id),
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
    launchedCourse,
    tasklog,
    sum,
  } = data;
  console.log(data);
  // = decrypt2(data);
  // try {
  //   const tasklogPrepared = prepareTaskLog(
  //     launchedCourse,
  //     lastcompleted,
  //     tasklog
  //   );
  // } catch (e) {
  //   return "error";
  // }
  const userMetaRef = db.collection("usermeta").doc(uid);
  if (unlocked.length != 0) {
    try {
      await userMetaRef.update({
        [`courses.${launchedCourse}.rating`]: pts,
        [`courses.${launchedCourse}.unlocked`]: allunlocked,
        [`courses.${launchedCourse}.lastunlocked`]: unlocked,
        [`courses.${launchedCourse}.stat.${lastcompleted}.sum`]: sum,
        // ...tasklogPrepared,
      });

      return "ok";
    } catch (error) {
      return "error";
    }
  } else {
    try {
      await userMetaRef.update({
        [`courses.${launchedCourse}.rating`]: pts,
        [`courses.${launchedCourse}.stat.${lastcompleted}.sum`]: sum,
        // ...tasklogPrepared,
      });
      return "ok";
    } catch (e) {
      return "error";
    }
  }
};

// TODO:remade
export const setUseMetaUnlockedAndCompleted = async (data) => {
  const { uid, lastcompleted, unlocked, launchedCourse } = decrypt2(data);
  const userMetaRef = db.collection("usermeta").doc(uid);
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
  return "ok";
};

//UTILITIES
const prepareTaskLog = (launchedCourse, lastcompleted, tasklog) => {
  let res = {};
  const dest = `courses.${launchedCourse}.stat.${lastcompleted}`;
  Object.keys(tasklog).forEach(
    (taskuuid) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res;
};

//LEGACY due to network cache
export const setUseMetaDataIncrement = async (data) => {
  const { uid, pts, lastcompleted, unlocked, launchedCourse, tasklog } =
    decrypt2(data);
  const tasklogPrepared = prepareTaskLog(
    launchedCourse,
    lastcompleted,
    tasklog
  );
  const userMetaRef = db.collection("usermeta").doc(uid);
  if (unlocked.length != 0) {
    await userMetaRef.update({
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
