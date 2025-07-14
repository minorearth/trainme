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
