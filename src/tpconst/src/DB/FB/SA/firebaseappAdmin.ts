// import "server-only";
// "use server";

import admin from "firebase-admin";

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export async function createFirebaseAdminApp(params: initAdmin) {
  const privateKey = formatPrivateKey(params.privateKey);
  if (admin.apps.length > 0) {
    return admin.app;
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
  // const firestore = admin.firestore();
}

interface initAdmin {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

let firestoreInstance: FirebaseFirestore.Firestore | null = null;

export async function initAdmin() {
  if (firestoreInstance) {
    return firestoreInstance;
  }
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
  };
  await createFirebaseAdminApp(params);
  firestoreInstance = admin.firestore();
  return firestoreInstance;
}
