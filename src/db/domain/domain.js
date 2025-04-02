import { db, auth } from "./firebaseapp";

import {
  updateDocFieldsInCollectionById,
  setDocInCollection,
  getDocDataFromCollectionById,
  getDocFromCollectionById,
  getDocFromCollectionByIdRealtime,
  addDocInCollection,
  getAllDocs,
  deleteDocFromCollection,
  copyDoc,
  updateUsersInChamp,
  updateChampStatus,
  updatePoinsInChamp,
  setTaskLogInChamp,
} from "@/db/CA/dataModel";

// import {
//   UploadFile,
//   deleteFileFromDB,
//   deleteAllFileFromDir,
//   getAllFiles,
//   deleteFile,
// } from "@/app/db/storage";

// import { setAllIndexed, createIndexspealout2 } from "@/app/db/indexAdmin";
import {
  setPersistenceDB,
  signIn,
  resetPsw,
  SignUpUser,
  signOutUser,
} from "@/db/CA/authentication";

import { createNewUser } from "@/db/CA/profile";

export const updateDocFieldsInCollectionByIdClient = async (
  collectionName,
  id,
  data
) => {
  await updateDocFieldsInCollectionById(db, collectionName, id, data);
};

export const setDocInCollectionClient = async (collectionName, data, id) => {
  await setDocInCollection(db, collectionName, data, id);
};

export const updateUsersInChampClient = async (collectionName, data, id) => {
  return await updateUsersInChamp(db, collectionName, data, id);
};

export const updatePoinsInChampClient = async (collectionName, data, id) => {
  await updatePoinsInChamp(db, collectionName, data, id);
};

export const setTaskLogInChampClient = async (collectionName, data, id) => {
  await setTaskLogInChamp(db, collectionName, data, id);
};

export const updateChampStatusClient = async (collectionName, status, id) => {
  await updateChampStatus(db, collectionName, status, id);
};
// export const increaseIndexCurrInCollectionClient = async (userId) => {
//   return await increaseIndexCurrInCollection(db, userId);
// };

// export const getCurrIndexDocIDClient = async (userId) => {
//   return await getCurrIndexDocID(db, userId);
// };

// export const getCurrIndexClient = async (userId) => {
//   return await getCurrIndex(db, userId);
// };

// export const searchInIndexClient = async (
//   manager,
//   userpart,
//   setSearchRows = () => {}
// ) => {
//   return await searchInIndex(db, manager, userpart, setSearchRows);
// };

// export const removeSurveyClient = async (syrveyid, userid) => {
//   await removeSurvey(db, storage, syrveyid, userid);
// };

export const getDocDataFromCollectionByIdClient = async (
  collectionName,
  id
) => {
  return await getDocDataFromCollectionById(db, collectionName, id);
};

// export const getDocsKeyValueClient = async (db, collectionName, key, value) => {
//   return await getDocsKeyValue(db, collectionName, key, value);
// };

export const getDocFromCollectionByIdClient = async (collectionName, id) => {
  return await getDocFromCollectionById(db, collectionName, id);
};

export const getDocFromCollectionByIdRealtimeClient = async (
  collectionName,
  id,
  refreshdata
) => {
  return await getDocFromCollectionByIdRealtime(
    db,
    collectionName,
    id,
    refreshdata
  );
};

export const addDocInCollectionClient = async (collectionName, data) => {
  return await addDocInCollection(db, collectionName, data);
};

export const getAllDocsClient = async (collectionName) => {
  return await getAllDocs(db, collectionName);
};

export const deleteDocFromCollectionClient = async (collectionName, id) => {
  await deleteDocFromCollection(db, collectionName, id);
};

// export const removeFileFromSurveyClient = async (
//   manager,
//   syrveyid,
//   filename
// ) => {
//   await removeFileFromSurvey(db, storage, manager, syrveyid, filename);
// };

// export const setAllIndexedClient = async (indexed) => {
//   await setAllIndexed(db, indexed);
// };

// export const UploadFileClient = async ({ file, folder }) => {
//   return await UploadFile({ storage, file, folder });
// };

// export const deleteFileFromDBClient = async (relativePath) => {
//   return deleteFileFromDB(storage, relativePath);
// };

// export const deleteAllFileFromDirClient = async (relativePath) => {
//   await deleteAllFileFromDir(storage, relativePath);
// };

// export const getAllFilesClient = async (relativePath) => {
//   return await getAllFiles(storage, relativePath);
// };

// export const deleteFileClient = async (relativePath) => {
//   await deleteFile(storage, relativePath);
// };

export const createNewUserClient = async (userId, name) => {
  return await createNewUser(db, userId, name);
};

// export const createIndexspealout = async (manager, slice) => {
//   await createIndexspealout2(db, manager, slice);
// };

export const сopyDocClient = async (collection, oldindex, newindex) => {
  await copyDoc(db, collection, oldindex, newindex);
};

// export const setPersistenceClient = async () => {
//   await setPersistenceDB(auth);
// };

export const signInClient = async (email, password) => {
  return await signIn(auth, email, password);
};

export const resetPswClient = (email) => {
  auth.languageCode = "ru";
  resetPsw(auth, email);
};

export const SignUpUserClient = async (email, password, name) => {
  // https://github.com/firebase/firebaseui-web/blob/master/LANGUAGES.md
  auth.languageCode = "ru";
  // auth.useDeviceLanguage();
  await SignUpUser(auth, email, password, name);
};

export const signOutUserClient = async () => {
  await signOutUser(auth);
};

// export const backupClient = async () => {
//   await backup(db);
// };
