"use server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";
import { encrypt2, decrypt2 } from "./encryption";

await initAdmin();

const admin = "EoufdeogIZN2e02o7MulUGhnscR2";

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
  const userMetaRef = firestore.collection("usermeta").doc(admin);
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
  const userMetaRef = firestore.collection("usermeta").doc(admin);
  userMetaRef.update({
    rating: 100000,
  });
};

export const unlockAndCompleteAll = async (unlocked) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(admin);
  userMetaRef.update({
    completed: unlocked,
    unlocked,
    lastunlocked: ["4680f00b-b586-413c-890a-9669b4b7b1c3"],
    paid: [],
  });
};

export const unlockAll = async (unlocked) => {
  const firestore = getFirestore();
  const userMetaRef = firestore.collection("usermeta").doc(admin);
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
      // [path2]: FieldValue.increment(pts),
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
