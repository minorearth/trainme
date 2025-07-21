import { auth } from "@/db/CA/firebaseappClient";

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

import E, { throwFBError } from "@/globals/errorMessages";
import { login, logout } from "@/db/SA/session";

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await logout();
  await setPersistence(auth, browserLocalPersistence);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e: unknown) {
    throw throwFBError(e);
  }
};

export const launchAuthStateChangeMonitor = async (
  action: (
    resolved: (value: string) => void,
    user: User | null,
    login: (value: string) => Promise<void>
  ) => void
) => {
  const uid = await new Promise(
    (resolved: (value: string) => void, rejected) => {
      onAuthStateChanged(auth, (user: User | null) =>
        action(resolved, user, login)
      );
    }
  );
  return uid;
};

export const createUser = async ({
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
  } catch (e: unknown) {
    throw throwFBError(e);
  }
};

export const resetPsw = (email: string) => {
  auth.languageCode = "ru";
  try {
    sendPasswordResetEmail(auth, email);
  } catch (e) {
    throw throwFBError(e);
  }
};

export const signOutUserRep = async () => {
  try {
    await signOut(auth);
    await logout();
  } catch (e) {
    throw throwFBError(e);
  }
};
