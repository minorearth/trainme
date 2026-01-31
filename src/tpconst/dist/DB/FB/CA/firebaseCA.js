"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultipleDocs = exports.getDocFromCollectionByIdRealtime = exports.getDocDataFromSubCollectionById = exports.getDocDataFromCollectionById = exports.updateDocByid = exports.setDocInSubCollection = exports.setDocInCollection = void 0;
const firestore_1 = require("firebase/firestore");
const errorHandlers_1 = require("../../../errorHandlers");
const firebaseappClient_1 = require("./firebaseappClient");
const setDocInCollection = async ({ collectionName, data, id, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(db, collectionName, id), data);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwFBError)(error);
    }
};
exports.setDocInCollection = setDocInCollection;
const setDocInSubCollection = async ({ collectionName, id, subCollectionName, subId, data, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(db, collectionName, id, subCollectionName, subId), data);
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.setDocInSubCollection = setDocInSubCollection;
const updateDocByid = async ({ collectionName, id, data, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        await (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, collectionName, id), data);
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.updateDocByid = updateDocByid;
const getDocDataFromCollectionById = async ({ collectionName, id, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        const docSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, collectionName, id));
        return docSnap.data();
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.getDocDataFromCollectionById = getDocDataFromCollectionById;
const getDocDataFromSubCollectionById = async ({ collectionName, id, subCollectionName, subId, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        const docSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(db, collectionName, id, subCollectionName, subId));
        return docSnap.data();
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.getDocDataFromSubCollectionById = getDocDataFromSubCollectionById;
const getDocFromCollectionByIdRealtime = async ({ collectionName, id, onChangeAction, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        const unsubscribe = (0, firestore_1.onSnapshot)((0, firestore_1.doc)(db, collectionName, id), (doc) => {
            //confirm as
            onChangeAction(doc.data());
        });
        return unsubscribe;
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.getDocFromCollectionByIdRealtime = getDocFromCollectionByIdRealtime;
const getMultipleDocs = async ({ collectionName, ids, }) => {
    try {
        const { db } = (0, firebaseappClient_1.initializeClient)();
        const col = (0, firestore_1.collection)(db, collectionName);
        const q = (0, firestore_1.query)(col, (0, firestore_1.where)((0, firestore_1.documentId)(), "in", ids));
        return multipleDocsToArray(await (0, firestore_1.getDocs)(q));
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.getMultipleDocs = getMultipleDocs;
const multipleDocsToArray = (docs) => {
    let ret = [];
    docs.forEach((doc) => {
        {
            const data = doc.data();
            ret.push(data);
        }
    });
    return ret;
};
//# sourceMappingURL=firebaseCA.js.map