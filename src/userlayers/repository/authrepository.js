import { db, auth } from "@/db/CA/firebaseappClient";

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

import { login, logout } from "@/db/SA/session";

export const signInUser = async (email, password) => {
  await setPersistence(auth, browserLocalPersistence);

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    return "wrongpsw";
  }
};

export const launchAuthStateChangeMonitor = async () => {
  const getid = new Promise((resolved, rejected) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        auth.languageCode = "ru";
        if (user.emailVerified) {
          await login("teacher");
          resolved(user.uid);
        } else {
          // sendEmailVerification(user).then(() => {});
          resolved("notVerified");
        }
      } else {
      }
    });
  });
  const uid = await getid;
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
