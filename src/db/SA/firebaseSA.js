"use server";
import { getFirestore } from "firebase-admin/firestore";
// import "server-only";
import { initAdmin } from "./firebaseAdmin";
import { encrypt2, decrypt2 } from "./encryption";

await initAdmin();

export const getData = async (data) => {
  const firestore = getFirestore();
  const { uid, pts } = decrypt2(data);
  console.log("meta", JSON.stringify(decrypt2(data)));

  const userMetaRef = firestore.collection("usermeta").doc(uid);
  const snapshot = await userMetaRef.get();
  console.log("fock", JSON.stringify(snapshot.data()));

  const { rating } = snapshot.data();
  userMetaRef.update({ rating: rating + pts });

  // Set the 'capital' field of the city

  // const documents = linkSnapshot.docs.map((link) => ({
  //   test: link.data().test,
  // }));
  // return JSON.stringify(linkSnapshot.data());
  console.log("fock", JSON.stringify(snapshot.data()));

  // return decrypt2(data);
};
