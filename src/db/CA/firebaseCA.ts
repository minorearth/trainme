import { DBFormats } from "@/T/typesDB";
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
}: {
  collectionName: string;
  data: T;
  id: string;
}) => {
  await setDoc(
    doc(db, collectionName, id),
    data as WithFieldValue<DocumentData>
  );
};

export const setDocInSubCollection = async <T extends DBFormats>({
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
  await setDoc(
    doc(db, collectionName1, id1, collectionName2, id2),
    data as WithFieldValue<DocumentData>
  );
};

export const updateDocByid = async <T extends DBFormats>(
  collectionName: string,
  id: string,
  data: Partial<T>
) => {
  await updateDoc(
    doc(db, collectionName, id),
    data as WithFieldValue<DocumentData>
  );
};

export const getDocDataFromCollectionById = async <T extends DBFormats>({
  collectionName,
  id,
}: {
  collectionName: string;
  id: string;
}) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  return docSnap.data() as T;
};

export const getDocDataFromSubCollectionById = async <T extends DBFormats>({
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
  const docSnap = await getDoc(
    doc(db, collectionName1, id1, collectionName2, id2)
  );
  return docSnap.data() as T;
};

export const getDocFromCollectionByIdRealtime = async <T extends DBFormats>({
  collectionName,
  id,
  onChangeAction,
}: {
  collectionName: string;
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
  collectionName: string;
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
