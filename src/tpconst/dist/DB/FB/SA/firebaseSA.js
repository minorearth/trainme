"use server";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCoursePaidSA2 = exports.checkCoursePaidSA = exports.getDocSA = exports.updateDocSA = void 0;
const errorHandlers_1 = require("../../../errorHandlers");
const const_1 = require("../../../const");
const firebaseappAdmin_1 = require("./firebaseappAdmin");
const updateDocSA = async ({ collectionName, datanotencrypted, }) => {
    try {
        const db = await (0, firebaseappAdmin_1.initAdmin)();
        const { data, id } = datanotencrypted;
        const res = { data, collectionName, id };
        try {
            const userMetaRef = db.collection(res.collectionName).doc(res.id);
            // const userMetaRef = db.collection("res.collectionName").doc(res.id);
            await userMetaRef.update(data);
        }
        catch (error) {
            const e = error;
            throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
        }
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.updateDocSA = updateDocSA;
const getDocSA = async ({ collectionName, id, }) => {
    try {
        const db = await (0, firebaseappAdmin_1.initAdmin)();
        const userMetaRef = db.collection(collectionName).doc(id);
        const snapshot = await userMetaRef.get();
        return snapshot.data();
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.getDocSA = getDocSA;
const checkCoursePaidSA = async (courseid, uid) => {
    try {
        const db = await (0, firebaseappAdmin_1.initAdmin)();
        const userMetaRef = db.collection(const_1.CLT.usermeta).doc(uid);
        const snapshot = await userMetaRef.get();
        const profile = snapshot.data();
        return profile?.paidcourses.includes(courseid);
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.checkCoursePaidSA = checkCoursePaidSA;
const checkCoursePaidSA2 = async (courseid, uid) => {
    try {
        const db = await (0, firebaseappAdmin_1.initAdmin)();
        const userMetaRef = db.collection(const_1.CLT.usermeta).doc(uid);
        const snapshot = await userMetaRef.get();
        const profile = snapshot.data();
        return profile?.paidcourses2[courseid];
    }
    catch (error) {
        const e = error;
        throw (0, errorHandlers_1.throwFBError)({ message: e.message, code: e.message });
    }
};
exports.checkCoursePaidSA2 = checkCoursePaidSA2;
//# sourceMappingURL=firebaseSA.js.map