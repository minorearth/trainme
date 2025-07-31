import {
  CollectionRead,
  CollectionWrite,
  CollectonsTypes,
  DBFormats,
  SubCollectionRead,
  SubCollectionWrite,
} from "tpconst/T";

import { db } from "./firebaseappClient";

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
  FirestoreError,
} from "firebase/firestore";
import { throwFBError } from "@/globals/errorsHandling/errorHandlers";

export const setDocInCollection = async <T extends DBFormats>({
  collectionName,
  data,
  id,
}: CollectionWrite<T>) => {
  try {
    await setDoc(
      doc(db, collectionName, id),
      data as WithFieldValue<DocumentData>
    );
  } catch (error) {
    throw throwFBError(error as FirestoreError);
  }
};

export const setDocInSubCollection = async <T extends DBFormats>({
  collectionName,
  id,
  subCollectionName,
  subId,
  data,
}: SubCollectionWrite<T>) => {
  try {
    await setDoc(
      doc(db, collectionName, id, subCollectionName, subId),
      data as WithFieldValue<DocumentData>
    );
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const updateDocByid = async <T extends DBFormats>({
  collectionName,
  id,
  data,
}: CollectionWrite<Partial<T>>) => {
  try {
    await updateDoc(
      doc(db, collectionName, id),
      data as WithFieldValue<DocumentData>
    );
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const getDocDataFromCollectionById = async <T extends DBFormats>({
  collectionName,
  id,
}: CollectionRead) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    return docSnap.data() as T;
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const getDocDataFromSubCollectionById = async <T extends DBFormats>({
  collectionName,
  id,
  subCollectionName,
  subId,
}: SubCollectionRead) => {
  try {
    const docSnap = await getDoc(
      doc(db, collectionName, id, subCollectionName, subId)
    );
    return docSnap.data() as T;
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
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
  try {
    const unsubscribe = onSnapshot(doc(db, collectionName, id), (doc) => {
      //confirm as
      onChangeAction(doc.data() as T);
    });
    return unsubscribe;
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const getMultipleDocs = async <T extends DBFormats>({
  collectionName,
  ids,
}: {
  collectionName: CollectonsTypes;
  ids: string[];
}) => {
  try {
    const col = collection(db, collectionName);
    const q = query(col, where(documentId(), "in", ids));
    return multipleDocsToArray<T>(await getDocs(q));
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
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
