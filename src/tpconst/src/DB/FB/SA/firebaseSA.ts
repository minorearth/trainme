"use server";
import {
  FirestoreError,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";

import {
  UserMetaDB,
  CollectionRead,
  CollectionWrite,
  CollectonsTypes,
  DBFormats,
} from "../../../T";

import {
  throwFBError,
  throwInnerError,
  E_CODES_DIALOG,
} from "../../../errorHandlers";

import { CLT } from "../../../const";

import { initAdmin } from "./firebaseappAdmin";

export const updateDocSA = async <T>({
  collectionName,
  datanotencrypted,
}: {
  collectionName: CollectonsTypes;
  datanotencrypted: { id: string; data: T };
}) => {
  try {
    const db = await initAdmin();

    const { data, id } = datanotencrypted;

    const res: CollectionWrite<T> = { data, collectionName, id };

    try {
      const userMetaRef = db.collection(res.collectionName).doc(res.id);
      // const userMetaRef = db.collection("res.collectionName").doc(res.id);
      await userMetaRef.update(data as WithFieldValue<DocumentData>);
    } catch (error) {
      const e = error as FirestoreError;
      throw throwFBError({ message: e.message, code: e.message });
    }
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getDocSA = async <T extends DBFormats>({
  collectionName,
  id,
}: CollectionRead) => {
  try {
    const db = await initAdmin();
    const userMetaRef = db.collection(collectionName).doc(id);
    const snapshot = await userMetaRef.get();
    return snapshot.data() as T;
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const checkCoursePaidSA = async (courseid: string, uid: string) => {
  try {
    const db = await initAdmin();
    const userMetaRef = db.collection(CLT.usermeta).doc(uid);
    const snapshot = await userMetaRef.get();
    const profile = snapshot.data() as UserMetaDB;
    return profile?.paidcourses.includes(courseid);
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};

export const checkCoursePaidSA2 = async (courseid: string, uid: string) => {
  try {
    const db = await initAdmin();
    const userMetaRef = db.collection(CLT.usermeta).doc(uid);
    const snapshot = await userMetaRef.get();
    const profile = snapshot.data() as UserMetaDB;
    return profile?.paidcourses2[courseid];
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ message: e.message, code: e.message });
  }
};
