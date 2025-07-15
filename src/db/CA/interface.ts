import { DocumentData, WithFieldValue } from "firebase/firestore";
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

export const setDocInCollectionClient = async <
  T extends WithFieldValue<DocumentData>
>({
  collectionName,
  data,
  id,
}: {
  collectionName: string;
  data: T;
  id: string;
}) => {
  await setDocInCollection<T>({ db, collectionName, data, id });
};

export const setDocInSubCollectionClient = async <
  T extends WithFieldValue<DocumentData>
>({
  collectionName1,
  id1,
  collectionName2,
  id2,
  data,
}: {
  collectionName1: string;
  id1: string;
  collectionName2: string;
  id2: string;
  data: T;
}) => {
  await setDocInSubCollection<T>({
    db,
    collectionName1,
    id1,
    collectionName2,
    id2,
    data,
  });
};

export const getDocDataFromCollectionByIdClient = async ({
  collectionName,
  id,
}: {
  collectionName: string;
  id: string;
}) => {
  return await getDocDataFromCollectionById({ db, collectionName, id });
};

export const updateDocByidClient = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
) => {
  return await updateDocByid<T>(db, collectionName, id, data);
};

export const getDocDataFromSubCollectionByIdClient = async ({
  collectionName1,
  id1,
  collectionName2,
  id2,
}: {
  collectionName1: string;
  id1: string;
  collectionName2: string;
  id2: string;
}) => {
  return await getDocDataFromSubCollectionById({
    db,
    collectionName1,
    id1,
    collectionName2,
    id2,
  });
};

export const getMultipleDocsClient = async <T>({
  collectionName,
  ids,
}: {
  collectionName: string;
  ids: string[];
}) => {
  return await getMultipleDocs<T>({ db, collectionName, ids });
};

export const getDocFromCollectionByIdRealtimeClient = async <T>({
  collectionName,
  id,
  onChangeAction,
}: {
  collectionName: string;
  id: string;
  onChangeAction: (data: T) => void;
}) => {
  return await getDocFromCollectionByIdRealtime<T>({
    db,
    collectionName,
    id,
    onChangeAction,
  });
};
