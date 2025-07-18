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

export const setDocInCollection = async <T>({
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

export const setDocInSubCollection = async <T>({
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

export const updateDocByid = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const getDocDataFromCollectionById = async <T>({
  collectionName,
  id,
}: {
  collectionName: string;
  id: string;
}) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  return docSnap.data() as T;
};

//TODO-make T extends DB types
export const getDocDataFromSubCollectionById = async <T>({
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

export const getDocFromCollectionByIdRealtime = async <T>({
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

export const getMultipleDocs = async <T>({
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

const multipleDocsToArray = <T>(docs: QuerySnapshot) => {
  let ret: T[] = [];
  docs.forEach((doc) => {
    {
      const data = doc.data() as T;
      ret.push(data);
    }
  });
  return ret;
};

// export const getDocFromCollectionById = async (
//   db: Firestore,
//   collectionName: string,
//   id: string
// ) => {
//   const docSnap = await getDoc(doc(db, collectionName, id));
//   const data = docSnap.data();
//   return { id: docSnap.id, ...data };
// };

// export const addDocInCollection = async <T>(
//   db: Firestore,
//   collectionName: string,
//   data:WithFieldValue<T>
// ) => {
//   const doc = await addDoc(collection(db, collectionName), data);
//   return doc.id;
// };

// export const getAllDocs = async (db: Firestore, collectionName: string) => {
//   const querySnapshot = await getDocs(collection(db, collectionName));
//   return querySnapshot;
// };

// export const deleteDocFromCollection = async (
//   db: Firestore,
//   collectionName: string,
//   id: string
// ) => {
//   deleteDoc(doc(db, collectionName, id));
// };

// export const copyDoc = async (
//   db: Firestore,
//   collection: string,
//   oldindex: string,
//   newindex: string
// ) => {
//   const res = await getDoc(doc(db, collection, oldindex));
//   const data = res.data();
//   setDoc(doc(db, collection, newindex), data);
// };
