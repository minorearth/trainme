import {
  CollectionRead,
  CollectionWrite,
  CollectonsTypes,
  DBFormats,
  SubCollectionRead,
  SubCollectionWrite,
} from "@/T/typesDB";
import { db, auth } from "./firebaseappClient";

import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  increment,
  documentId,
  Firestore,
  UpdateData,
  WithFieldValue,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

export const setDocInCollection = async <T extends DBFormats>({
  collectionName,
  data,
  id,
}: CollectionWrite<T>) => {
  await setDoc(
    doc(db, collectionName, id),
    data as WithFieldValue<DocumentData>
  );
};

export const setDocInSubCollection = async <T extends DBFormats>({
  collectionName,
  id,
  subCollectionName,
  subId,
  data,
}: SubCollectionWrite<T>) => {
  await setDoc(
    doc(db, collectionName, id, subCollectionName, subId),
    data as WithFieldValue<DocumentData>
  );
};

export const updateDocByid = async <T extends DBFormats>({
  collectionName,
  id,
  data,
}: CollectionWrite<Partial<T>>) => {
  await updateDoc(
    doc(db, collectionName, id),
    data as WithFieldValue<DocumentData>
  );
};

export const getDocDataFromCollectionById = async <T extends DBFormats>({
  collectionName,
  id,
}: CollectionRead) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  return docSnap.data() as T;
};

export const getDocDataFromSubCollectionById = async <T extends DBFormats>({
  collectionName,
  id,
  subCollectionName,
  subId,
}: SubCollectionRead) => {
  const docSnap = await getDoc(
    doc(db, collectionName, id, subCollectionName, subId)
  );
  return docSnap.data() as T;
};

export const getDocFromCollectionByIdRealtime = async <T extends DBFormats>({
  collectionName,
  id,
  onChangeAction,
}: {
  collectionName: CollectonsTypes;
  id: string;
  onChangeAction: (data: T) => void;
}) => {
  const unsubscribe = onSnapshot(doc(db, collectionName, id), (doc) => {
    //confirm as
    onChangeAction(doc.data() as T);
  });
  return unsubscribe;
};

export const getMultipleDocs = async <T extends DBFormats>({
  collectionName,
  ids,
}: {
  collectionName: CollectonsTypes;
  ids: string[];
}) => {
  const col = collection(db, collectionName);
  const q = query(col, where(documentId(), "in", ids));
  return multipleDocsToArray<T>(await getDocs(q));
};

type FBResponse<T> = T & {
  id: string;
};

const multipleDocsToArray = <T extends DBFormats>(docs: QuerySnapshot) => {
  let ret: T[] = [];
  docs.forEach((doc) => {
    {
      const data = doc.data() as T;
      ret.push(data);
    }
  });
  return ret;
};
