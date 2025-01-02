"use server";
import { getFirestore } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";

await initAdmin();

export const getLinks = async () => {
  const firestore = getFirestore();
  const linkSnapshot = await firestore.collection("test").get();
  const documents = linkSnapshot.docs.map((link) => ({
    test: link.data().test,
  }));
  return documents;
};
