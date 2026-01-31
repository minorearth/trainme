"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCoursePaidDBSA = exports.getUserCourseMetaDBSA = exports.getPaymentIdDBSA = exports.getUserMetaDBSA = exports.buyCourseDBSA = exports.saveProgressDBSA = exports.saveProgressDBSAFull = exports.paychapterDBSA = exports.setMoneyDBSA = exports.completeAllChaptersDBSA = exports.unlockAllChaptersDBSA = void 0;
exports.resetUser = resetUser;
//DB
const SA_1 = require("../../DB/FB/SA");
const uuid_1 = require("uuid");
//utils
const utils_1 = require("../../utils");
const errorHandlers_1 = require("../../errorHandlers");
const const_1 = require("../../const");
const ETL_1 = require("./ETL");
const decryptData2 = (dataEncrypted) => {
    try {
        const decyptedData = (0, utils_1.decrypt2)(dataEncrypted);
        return decyptedData;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(new Error(errorHandlers_1.E_CODES.DECRYPTION_FAILED));
    }
};
// setters
async function resetUser(dataEncrypted) {
    let datanotencrypted;
    try {
        const { firstchapter, uid, courseid } = decryptData2(dataEncrypted);
        datanotencrypted = {
            data: {
                [`courses.${courseid}`]: {
                    completed: [],
                    unlocked: [firstchapter],
                    lastunlocked: [firstchapter],
                    paid: [],
                    stat: {},
                    rating: 0,
                },
            },
            id: uid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
}
const unlockAllChaptersDBSA = async (dataEncrypted) => {
    let datanotencrypted;
    try {
        const { courseid, chaptersIds, userid, firstchapter } = decryptData2(dataEncrypted);
        datanotencrypted = {
            data: {
                [`courses.${courseid}.completed`]: [],
                [`courses.${courseid}.unlocked`]: chaptersIds,
                [`courses.${courseid}.lastunlocked`]: [firstchapter],
            },
            id: userid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.unlockAllChaptersDBSA = unlockAllChaptersDBSA;
const completeAllChaptersDBSA = async (dataEncrypted) => {
    let datanotencrypted;
    try {
        const { courseid, chaptersIds, userid, firstchapter } = decryptData2(dataEncrypted);
        datanotencrypted = {
            data: {
                [`courses.${courseid}.completed`]: chaptersIds,
                [`courses.${courseid}.unlocked`]: chaptersIds,
                [`courses.${courseid}.lastunlocked`]: [firstchapter],
                [`courses.${courseid}.paid`]: chaptersIds,
            },
            id: userid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.completeAllChaptersDBSA = completeAllChaptersDBSA;
const setMoneyDBSA = async (dataEncrypted) => {
    let datanotencrypted;
    try {
        const { courseid, inValue, userid } = decryptData2(dataEncrypted);
        datanotencrypted = {
            data: { [`courses.${courseid}.rating`]: Number(inValue) },
            id: userid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.setMoneyDBSA = setMoneyDBSA;
const paychapterDBSA = async ({ dataEncrypted, }) => {
    let datanotencrypted;
    try {
        const { rating, lastunlocked, paid, courseid, userid } = decryptData2(dataEncrypted);
        datanotencrypted = {
            data: {
                [`courses.${courseid}.rating`]: rating,
                [`courses.${courseid}.lastunlocked`]: lastunlocked,
                [`courses.${courseid}.paid`]: paid,
            },
            id: userid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.paychapterDBSA = paychapterDBSA;
const saveProgressDBSAFull = async ({ dataEncrypted, }) => {
    let datanotencrypted;
    try {
        const { rating, tasklog, courseid, userid, sum, chapterid, unlocked, lastunlocked, completed, } = decryptData2(dataEncrypted);
        const tasklogPrepared = (0, ETL_1.taskLogToDBFormat)({
            courseid,
            lastcompleted: chapterid,
            tasklog,
        });
        datanotencrypted = {
            data: {
                [`courses.${courseid}.rating`]: rating,
                [`courses.${courseid}.stat.${chapterid}.sum`]: sum,
                [`courses.${courseid}.completed`]: completed,
                //all unlocked chapters(more than completed by lastunlocked)
                [`courses.${courseid}.unlocked`]: unlocked,
                //next chapters after just completed
                [`courses.${courseid}.lastunlocked`]: lastunlocked,
                ...tasklogPrepared,
            },
            id: userid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.saveProgressDBSAFull = saveProgressDBSAFull;
const saveProgressDBSA = async ({ dataEncrypted, }) => {
    let datanotencrypted;
    try {
        const { rating, tasklog, courseid, userid, sum, chapterid } = decryptData2(dataEncrypted);
        const tasklogPrepared = (0, ETL_1.taskLogToDBFormat)({
            courseid,
            lastcompleted: chapterid,
            tasklog,
        });
        datanotencrypted = {
            data: {
                [`courses.${courseid}.rating`]: rating,
                [`courses.${courseid}.stat.${chapterid}.sum`]: sum,
                ...tasklogPrepared,
            },
            id: userid,
        };
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.saveProgressDBSA = saveProgressDBSA;
const buyCourseDBSA = async ({ uid, courseid, }) => {
    const datanotencrypted = {
        data: {
            [`paidcourses2.${courseid}`]: true,
        },
        id: uid,
    };
    try {
        await (0, SA_1.updateDocSA)({
            collectionName: const_1.CLT.usermeta,
            datanotencrypted,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.buyCourseDBSA = buyCourseDBSA;
// getters
const getUserMetaDBSA = async (id) => {
    const data = await (0, SA_1.getDocSA)({
        collectionName: const_1.CLT.usermeta,
        id,
    });
    return data;
};
exports.getUserMetaDBSA = getUserMetaDBSA;
//TODO:moveToSpecific file
const getPaymentIdDBSA = async (data) => {
    const myHeaders = new Headers();
    const user = "1138711";
    const password = "test_U5BQCbtM-8EbukKeHySB89i58dxNUV4O0_QzxK0vq2Q";
    const idempotenceKey = (0, uuid_1.v4)();
    myHeaders.append("Idempotence-Key", idempotenceKey);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Basic ${btoa(`${user}:${password}`)}`);
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow",
    };
    const response = await fetch("https://api.yookassa.ru/v3/payments", requestOptions);
    const res = await response.json();
    return res.confirmation.confirmation_token;
};
exports.getPaymentIdDBSA = getPaymentIdDBSA;
const getUserCourseMetaDBSA = async (id, courseid) => {
    try {
        const data = await (0, SA_1.getDocSA)({
            collectionName: const_1.CLT.usermeta,
            id,
        });
        let userProgress;
        try {
            userProgress = (0, ETL_1.ETLUserProgress)(data.courses[courseid]);
        }
        catch (error) {
            throw (0, errorHandlers_1.throwErrorValue)(errorHandlers_1.E_CODES.PROCEDURE_ERROR, "ETLUserProgress");
        }
        return userProgress;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getUserCourseMetaDBSA = getUserCourseMetaDBSA;
const checkCoursePaidDBSA = async (courseid, uid) => {
    const value = await (0, SA_1.checkCoursePaidSA)(courseid, uid);
    return value;
};
exports.checkCoursePaidDBSA = checkCoursePaidDBSA;
//# sourceMappingURL=repositoryFBSA.js.map