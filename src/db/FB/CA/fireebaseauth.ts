import { auth } from "@/db/FB/CA/firebaseappClient";

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

import E, { throwFBError } from "@/globals/errorsHandling/errorHandlers";
import { login, logout } from "@/db/FB/SA/session";
import { FirestoreError } from "firebase/firestore";

export const signInUserDB = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
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
  const uid = await new Promise(
    (resolved: (value: string) => void, rejected) => {
      onAuthStateChanged(auth, (user: User | null) =>
        action(resolved, user?.uid || "", user?.emailVerified || false)
      );
    }
  );
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
    await signOut(auth);
  } catch (error) {
    const e = error as FirestoreError;
    throw throwFBError({ code: e.code, message: e.message });
  }
};
