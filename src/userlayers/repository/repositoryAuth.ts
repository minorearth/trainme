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
} from "firebase/auth";

//api calls
import { getDataFetch } from "@/apicalls/apicalls";

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
  } catch (e) {
    return "wrongpsw";
  }
};

export const launchAuthStateChangeMonitor = async (
  action: (
    resolved: (value: string) => string,
    user: User | null,
    login: (value: string) => Promise<void>
  ) => string
) => {
  const uid = await new Promise((resolved, rejected) => {
    onAuthStateChanged(auth, (user: User | null) =>
      action(resolved, user, login)
    );
  });
  return uid;
};

export const createUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  sendEmailVerification(userCredential.user).then(() => {});
  return userCredential.user;
};

export const resetPsw = (email) => {
  auth.languageCode = "ru";
  sendPasswordResetEmail(auth, email);
};

export const signOutUserRep = async () => {
  await signOut(auth);
  await logout();
};
