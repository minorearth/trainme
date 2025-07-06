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
} from "firebase/auth";

//api calls
import { getDataFetch } from "@/apicalls/apicalls";

import { login, logout } from "@/db/SA/session";

export const signInUser = async (email, password) => {
  await logout();
  await setPersistence(auth, browserLocalPersistence);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    return "wrongpsw";
  }
};

export const launchAuthStateChangeMonitor = async (action) => {
  const uid = await new Promise((resolved, rejected) => {
    onAuthStateChanged(auth, (user) => action(resolved, user, login));
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
