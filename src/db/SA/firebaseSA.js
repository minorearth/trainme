"use server";
import { decrypt2 } from "./encryption";
import { db } from "./firebaseappAdmin";

export const updateDocSA = async (collection, dataencrypted) => {
  const { data, id } = decrypt2(dataencrypted);
  const userMetaRef = db.collection(collection).doc(id);
  try {
    await userMetaRef.update(data);
    return "ok";
  } catch (error) {
    return "error";
  }
};

export const getDocSA = async (collection, data) => {
  const { id } = data;
  const userMetaRef = db.collection(collection).doc(id);
  const snapshot = await userMetaRef.get();
  return snapshot.data();
};

export const checkCoursePaidSA = async (data) => {
  const { courseid, uid } = data;
  const userMetaRef = db.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  const profile = snapshot.data();
  return profile.paidcourses.includes(courseid);
};

// export const setUseMetaData = async (data) => {
//   const {
//     uid,
//     pts,
//     lastcompleted,
//     unlocked,
//     allunlocked,
//     courseid,
//     tasklog,
//     sum,
//     completed,
//     repeat,
//   } = decrypt2(data);

//   const tasklogPrepared = prepareTaskLog(courseid, lastcompleted, tasklog);
//   const userMetaRef = db.collection("usermeta").doc(uid);
//   if (!repeat) {
//     try {
//       await userMetaRef.update({
//         //all completed chapters
//         [`courses.${courseid}.completed`]: completed,
//         [`courses.${courseid}.rating`]: pts,
//         //all unlocked chapters(more than completed by lastunlocked)
//         [`courses.${courseid}.unlocked`]: allunlocked,
//         //next chapters after just completed
//         [`courses.${courseid}.lastunlocked`]: unlocked,
//         [`courses.${courseid}.stat.${lastcompleted}.sum`]: sum,
//         ...tasklogPrepared,
//       });

//       return "ok";
//     } catch (error) {
//       return "error";
//     }
//   } else {
//     try {
//       await userMetaRef.update({
//         [`courses.${courseid}.rating`]: pts,
//         [`courses.${courseid}.stat.${lastcompleted}.sum`]: sum,
//         ...tasklogPrepared,
//       });
//       return "ok";
//     } catch (e) {
//       return "error";
//     }
//   }
// };

// export const setUseMetaUnlockedAndCompleted = async (data) => {
//   const { uid, lastcompleted, unlocked, courseid } = decrypt2(data);
//   const userMetaRef = db.collection("usermeta").doc(uid);
//   if (unlocked.length != 0) {
//     userMetaRef.update({
//       [`courses.${courseid}.completed`]: FieldValue.arrayUnion(lastcompleted),
//       [`courses.${courseid}.unlocked`]: FieldValue.arrayUnion(...unlocked),
//       [`courses.${courseid}.lastunlocked`]: unlocked,
//     });
//   } else {
//     userMetaRef.update({
//       [`courses.${courseid}.completed`]: FieldValue.arrayUnion(lastcompleted),
//     });
//   }
//   return "ok";
// };
