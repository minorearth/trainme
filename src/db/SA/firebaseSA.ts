"use server";
import { DocumentData, WithFieldValue } from "firebase/firestore";
import { decrypt2 } from "@/globals/utils/encryption";

import { db } from "./firebaseappAdmin";
import {
  CollectionRead,
  // CollectionWrite,
  CollectonsTypes,
  DBFormats,
  UserMetaDB,
} from "@/T/typesDB";

import { CollectionWrite } from "trainpythontypes";

import { CLT } from "@/T/const";

import { throwFBError } from "@/globals/errorMessages";

export const updateDocSA = async <T extends DBFormats>({
  collectionName,
  dataencrypted,
}: {
  collectionName: CollectonsTypes;
  dataencrypted: string;
}) => {
  try {
    const { data, id } = decrypt2(dataencrypted);
    const res: CollectionWrite<T> = { data, collectionName, id };
    const userMetaRef = db.collection(res.collectionName).doc(res.id);
    await userMetaRef.update(data as WithFieldValue<DocumentData>);
  } catch (error: unknown) {
    throw throwFBError(error);
  }
};

export const getDocSA = async <T extends DBFormats>({
  collectionName,
  id,
}: CollectionRead) => {
  try {
    const userMetaRef = db.collection(collectionName).doc(id);
    const snapshot = await userMetaRef.get();
    return snapshot.data() as T;
  } catch (error) {
    throw throwFBError(error);
  }
};

export const checkCoursePaidSA = async (data: {
  courseid: string;
  id: string;
}) => {
  try {
    const { courseid, id } = data;
    const userMetaRef = db.collection(CLT.usermeta).doc(id);
    const snapshot = await userMetaRef.get();
    const profile = snapshot.data() as UserMetaDB;
    return profile?.paidcourses.includes(courseid);
  } catch (error) {
    throw throwFBError(error);
  }
};
