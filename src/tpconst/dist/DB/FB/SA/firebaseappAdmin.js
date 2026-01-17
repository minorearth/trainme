"use strict";
// import "server-only";
// "use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirebaseAdminApp = createFirebaseAdminApp;
exports.initAdmin = initAdmin;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function formatPrivateKey(key) {
    return key.replace(/\\n/g, "\n");
}
async function createFirebaseAdminApp(params) {
    const privateKey = formatPrivateKey(params.privateKey);
    if (firebase_admin_1.default.apps.length > 0) {
        return firebase_admin_1.default.app;
    }
    const cert = firebase_admin_1.default.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey,
    });
    firebase_admin_1.default.initializeApp({
        credential: cert,
        projectId: params.projectId,
        storageBucket: params.storageBucket,
    });
    // const firestore = admin.firestore();
}
let firestoreInstance = null;
async function initAdmin() {
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
    firestoreInstance = firebase_admin_1.default.firestore();
    return firestoreInstance;
}
//# sourceMappingURL=firebaseappAdmin.js.map