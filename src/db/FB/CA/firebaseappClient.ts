"use client";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, initializeFirestore } from "firebase/firestore";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { logout } from "@/globals/next/session";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// User is signed in, see docs for a list of available properties
// https://firebase.google.com/docs/reference/js/auth.user
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const initializeClient = () => {
  if (db && auth) return { db, auth };
  app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    //TS error:
    // useFetchStreams: false,
  });
  auth = getAuth(app);
  return { db, auth };
};

export const startUidMonitor = (setUserid: (id: string) => void) => {
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
