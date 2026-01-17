"use client";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  browserSessionPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  User,
  NextOrObserver,
  UserCredential,
} from "firebase/auth";

import { throwFBError } from "../../../errorHandlers";
import { FirestoreError } from "firebase/firestore";
import { initializeClient } from "./firebaseappClient";

export const signInUserDB = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { auth } = initializeClient();

  await setPersistence(auth, browserLocalPersistence);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    const e = error as FirestoreError;
    throw throwFBError({ code: e.code, message: e.message });
  }
};

export const launchAuthStateChangeMonitorDB = async (
  action: (
    resolved: (value: string) => void,
    uid: string,
    emailVerified: boolean
  ) => void
) => {
  const { auth } = initializeClient();

  let unsubscribe = () => {};
  const uid = await new Promise(
    (resolved: (value: string) => void, rejected) => {
      unsubscribe = onAuthStateChanged(auth, (user: User | null) =>
        action(resolved, user?.uid || "", user?.emailVerified || false)
      );
    }
  );
  unsubscribe();
  return uid;
};

export const createUserDB = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { auth } = initializeClient();

    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    sendEmailVerification(userCredential.user).then(() => {});
    return userCredential.user;
  } catch (error: unknown) {
    const e = error as FirestoreError;
    throw throwFBError({ code: e.code, message: e.message });
  }
};

export const resetPswDB = async (email: string) => {
  const { auth } = initializeClient();

  auth.languageCode = "ru";
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ code: e.code, message: e.message });
  }
};

export const signOutUserDB = async () => {
  try {
    const { auth } = initializeClient();

    await signOut(auth);
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ code: e.code, message: e.message });
  }
};

export const startUidMonitor = (
  setUserid: (id: string) => void,
  logout: () => void
) => {
  const { auth } = initializeClient();
  onAuthStateChanged(auth, (fbuser) => {
    if (fbuser) {
      const uid = fbuser.uid;
      setUserid(uid);
    } else {
      logout();
    }
  });
};
