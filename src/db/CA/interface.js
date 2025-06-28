import { db, auth } from "./firebaseappClient";

import {
  setDocInCollection,
  setDocInSubCollection,
  getDocDataFromCollectionById,
  getMultipleDocs,
  getDocDataFromSubCollectionById,
  getDocFromCollectionByIdRealtime,
  updateDocByid,
} from "@/db/CA/firebaseCA";

export const setDocInCollectionClient = async (collectionName, data, id) => {
  await setDocInCollection(db, collectionName, data, id);
};

export const setDocInSubCollectionClient = async (
  collectionName1,
  id1,
  collectionName2,
  id2,
  data
) => {
  await setDocInSubCollection(
    db,
    collectionName1,
    id1,
    collectionName2,
    id2,
    data
  );
};

export const getDocDataFromCollectionByIdClient = async (
  collectionName,
  id
) => {
  return await getDocDataFromCollectionById(db, collectionName, id);
};

export const updateDocByidClient = async (collectionName, id, data) => {
  return await updateDocByid(db, collectionName, id, data);
};

export const getDocDataFromSubCollectionByIdClient = async (
  collectionName1,
  id1,
  collectionName2,
  id2
) => {
  return await getDocDataFromSubCollectionById(
    db,
    collectionName1,
    id1,
    collectionName2,
    id2
  );
};

export const getMultipleDocsClient = async (collectionName, ids) => {
  return await getMultipleDocs(db, collectionName, ids);
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

// export const getDocFromCollectionByIdClient = async (collectionName, id) => {
//   return await getDocFromCollectionById(db, collectionName, id);
// };

// export const addDocInCollectionClient = async (collectionName, data) => {
//   return await addDocInCollection(db, collectionName, data);
// };

// export const getAllDocsClient = async (collectionName) => {
//   return await getAllDocs(db, collectionName);
// };

// export const сopyDocClient = async (collection, oldindex, newindex) => {
//   await copyDoc(db, collection, oldindex, newindex);
// };

// export const deleteDocFromCollectionClient = async (collectionName, id) => {
//   await deleteDocFromCollection(db, collectionName, id);
// };

// import {
//   UploadFile,
//   deleteFileFromDB,
//   deleteAllFileFromDir,
//   getAllFiles,
//   deleteFile,
// } from "@/app/db/storage";

// import { setAllIndexed, createIndexspealout2 } from "@/app/db/indexAdmin";

// export const backupClient = async () => {
//   await backup(db);
// };

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

// export const createIndexspealout = async (manager, slice) => {
//   await createIndexspealout2(db, manager, slice);
// };

// export const setPersistenceClient = async () => {
//   await setPersistenceDB(auth);
// };

// export const getDocsKeyValueClient = async (db, collectionName, key, value) => {
//   return await getDocsKeyValue(db, collectionName, key, value);
// };

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
