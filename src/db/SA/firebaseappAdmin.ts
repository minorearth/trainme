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
  // firestore.settings({ timeout: 10000 });
}

interface initAdmin {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}
export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
  };
  await createFirebaseAdminApp(params);
  const firestore = admin.firestore();
  return firestore;
}

const db = await initAdmin();

export { db };
