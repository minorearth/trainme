"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeClient = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
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
let app = null;
let db = null;
let auth = null;
const initializeClient = () => {
    if (db && auth)
        return { db, auth };
    app = (0, app_1.initializeApp)(firebaseConfig);
    db = (0, firestore_1.initializeFirestore)(app, {
        experimentalForceLongPolling: true,
        //TS error:
        // useFetchStreams: false,
    });
    auth = (0, auth_1.getAuth)(app);
    return { db, auth };
};
exports.initializeClient = initializeClient;
//# sourceMappingURL=firebaseappClient.js.map