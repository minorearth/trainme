"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startUidMonitor = exports.signOutUserDB = exports.resetPswDB = exports.createUserDB = exports.launchAuthStateChangeMonitorDB = exports.signInUserDB = void 0;
const auth_1 = require("firebase/auth");
const errorHandlers_1 = require("../../../errorHandlers");
const firebaseappClient_1 = require("./firebaseappClient");
const signInUserDB = async ({ email, password, }) => {
    const { auth } = (0, firebaseappClient_1.initializeClient)();
    await (0, auth_1.setPersistence)(auth, auth_1.browserLocalPersistence);
    try {
        await (0, auth_1.signInWithEmailAndPassword)(auth, email, password);
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ code: e.code, message: e.message });
    }
};
exports.signInUserDB = signInUserDB;
const launchAuthStateChangeMonitorDB = async (action) => {
    const { auth } = (0, firebaseappClient_1.initializeClient)();
    let unsubscribe = () => { };
    try {
        const uid = await new Promise((resolved, rejected) => {
            unsubscribe = (0, auth_1.onAuthStateChanged)(auth, (user) => action(resolved, rejected, user?.uid || "", user?.emailVerified || false));
        });
        return uid;
    }
    catch (e) {
        throw new Error(errorHandlers_1.E_CODES.EMAIL_NOT_VERIFIED);
    }
    finally {
        unsubscribe();
    }
};
exports.launchAuthStateChangeMonitorDB = launchAuthStateChangeMonitorDB;
const createUserDB = async ({ email, password, }) => {
    try {
        const { auth } = (0, firebaseappClient_1.initializeClient)();
        const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(auth, email, password);
        (0, auth_1.sendEmailVerification)(userCredential.user).then(() => { });
        return userCredential.user;
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ code: e.code, message: e.message });
    }
};
exports.createUserDB = createUserDB;
const resetPswDB = async (email) => {
    const { auth } = (0, firebaseappClient_1.initializeClient)();
    auth.languageCode = "ru";
    try {
        await (0, auth_1.sendPasswordResetEmail)(auth, email);
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ code: e.code, message: e.message });
    }
};
exports.resetPswDB = resetPswDB;
const signOutUserDB = async () => {
    try {
        const { auth } = (0, firebaseappClient_1.initializeClient)();
        await (0, auth_1.signOut)(auth);
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ code: e.code, message: e.message });
    }
};
exports.signOutUserDB = signOutUserDB;
const startUidMonitor = (setUserid, logout) => {
    const { auth } = (0, firebaseappClient_1.initializeClient)();
    (0, auth_1.onAuthStateChanged)(auth, (fbuser) => {
        if (fbuser) {
            const uid = fbuser.uid;
            setUserid(uid);
        }
        else {
            logout();
        }
    });
};
exports.startUidMonitor = startUidMonitor;
//# sourceMappingURL=fireebaseauth.js.map