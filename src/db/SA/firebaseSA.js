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

export const setUseMetaData = async (data) => {
  const firestore = getFirestore();
  const { uid, pts, lastcompleted, unlocked, launchedCourse } = decrypt2(data);
  const userMetaRef = firestore.collection("usermeta").doc(uid);
  // const path = `courses.${launchedCourse}`;
  // const path2 = `stat.${lastcompleted}.sum`;
  if (unlocked.length != 0) {
    userMetaRef.update({
      [`courses.${launchedCourse}.rating`]: FieldValue.increment(pts),
      [`courses.${launchedCourse}.completed`]:
        FieldValue.arrayUnion(lastcompleted),
      [`courses.${launchedCourse}.unlocked`]: FieldValue.arrayUnion(
        ...unlocked
      ),
      [`courses.${launchedCourse}.lastunlocked`]: unlocked,
      [`courses.${launchedCourse}.stat.${lastcompleted}.sum`]:
        FieldValue.increment(pts),
    });
  } else {
    userMetaRef.update({
      [`courses.${launchedCourse}`]: {
        rating: FieldValue.increment(pts),
        completed: FieldValue.arrayUnion(lastcompleted),
        [`stat.${lastcompleted}.sum`]: FieldValue.increment(pts),
      },
    });
  }
};

// export const setUseMetaData2 = async (data) => {
//   const firestore = getFirestore();
//   const userMetaRef = firestore.collection("usermeta").doc(uid);

//   const { uid, pts, lastcompleted, unlocked, launchedCourse } = decrypt2(data);
//   const currdata = await getUseMetaData(uid);
//   const course = currdata.courses[launchedCourse];
//   course.rating += pts;
//   !course.completed.includes(lastcompleted) &&
//     course.completed.push(lastcompleted);
//   if (course.stat[lastcompleted]) {
//     course.stat[lastcompleted].sum += pts;
//   } else {
//     course.stat[lastcompleted] = { sum: pts };
//   }

//   if (unlocked.length != 0) {
//     !course.unlocked.includes(unlocked) && course.unlocked.push(...unlocked);
//     course.lastunlocked = unlocked;
//     userMetaRef.update({ ...currdata });
//   } else {
//     userMetaRef.update({
//       [`courses.${launchedCourse}`]: {
//         rating: FieldValue.increment(pts),
//         completed: FieldValue.arrayUnion(lastcompleted),
//         [`stat.${lastcompleted}.sum`]: FieldValue.increment(pts),
//       },
//     });
//   }
// };
