"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUserMeta = exports.getUserMetaDataCA = exports.getAllCourseTasks = exports.getTextBookTasks = exports.getAllTasksFromChapter = exports.getAllTasksDataObj = exports.getUsersMetaObj = exports.getSnapShot = exports.saveSnapshot = exports.addUserToGroup = exports.updateNodeLabelDB = exports.addNewGroupDB = exports.getChaptersObjdata = exports.getGroupsArr = exports.getChapterIds_admin = exports.getFlowDB = exports.uploadCourseChaptersObject = exports.uploadChapterTasks = exports.uploadAllCourseTasksView = exports.uploadCourseChapters = exports.setChampStarted = exports.createNewChamp = exports.getUserChampStatus = exports.updateUserInChamp = exports.subscribeOnChamp = exports.getChampTasksDB = exports.saveChampUserTaskLog = exports.updateChampPoints = void 0;
const CA_1 = require("../../DB/FB/CA");
//types
const const_1 = require("../../const");
//ETL
const ETLGroups_1 = require("./ETL/ETLGroups");
const ETLPivot_1 = require("./ETL/ETLPivot");
const ETLadmin_1 = require("./ETL/ETLadmin");
const errorHandlers_1 = require("../../errorHandlers");
const fbconfig_1 = require("./fbconfig");
//eror handling
const updateChampPoints = async ({ pts, champid, userid, }) => {
    try {
        await (0, CA_1.updateDocByid)({
            collectionName: const_1.CLT.champ,
            id: champid,
            data: {
                [`users.${userid}.pts`]: pts,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.updateChampPoints = updateChampPoints;
const saveChampUserTaskLog = ({ tasklog, champid, userid, }) => {
    try {
        (0, CA_1.updateDocByid)({
            collectionName: const_1.CLT.champ,
            id: champid,
            data: {
                [`users.${userid}.tasklog`]: tasklog,
                [`users.${userid}.persstatus`]: const_1.PS.champisover,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.saveChampUserTaskLog = saveChampUserTaskLog;
const getChampTasksDB = async ({ champid }) => {
    try {
        const allTasks = await (0, CA_1.getDocDataFromCollectionById)({
            collectionName: const_1.CLT.champ,
            id: champid,
        });
        return allTasks?.tasks || [];
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getChampTasksDB = getChampTasksDB;
const subscribeOnChamp = async ({ champid, action, duration, }) => {
    try {
        const unsubscribe = await (0, CA_1.getDocFromCollectionByIdRealtime)({
            collectionName: const_1.CLT.champ,
            id: champid,
            onChangeAction: action,
        });
        //TODO: (later)test
        setInterval(() => {
            unsubscribe();
        }, duration);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.subscribeOnChamp = subscribeOnChamp;
const updateUserInChamp = async ({ champuserdata, champid, userid, }) => {
    try {
        await (0, CA_1.updateDocByid)({
            collectionName: const_1.CLT.champ,
            id: champid,
            data: {
                [`users.${userid}`]: champuserdata,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.updateUserInChamp = updateUserInChamp;
const getUserChampStatus = async ({ userid, champid, }) => {
    try {
        const champData = await (0, CA_1.getDocDataFromCollectionById)({
            collectionName: const_1.CLT.champ,
            id: champid,
        });
        if (!champData?.users[userid]?.persstatus) {
            return const_1.PS.undefined;
        }
        else {
            return champData?.users[userid].persstatus;
        }
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getUserChampStatus = getUserChampStatus;
const createNewChamp = async ({ tasks, champid, }) => {
    try {
        await (0, CA_1.setDocInCollection)({
            collectionName: const_1.CLT.champ,
            data: { tasks, users: {}, status: const_1.CS.created },
            id: champid,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.createNewChamp = createNewChamp;
const setChampStarted = async ({ champid }) => {
    try {
        await (0, CA_1.updateDocByid)({
            collectionName: const_1.CLT.champ,
            id: champid,
            data: {
                status: const_1.CS.started,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.setChampStarted = setChampStarted;
//Admin panel
const uploadCourseChapters = async ({ nodes, edges, courseid, }) => {
    try {
        await (0, CA_1.setDocInCollection)({
            collectionName: const_1.CLT.chapters,
            data: { nodes, edges },
            id: courseid,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.uploadCourseChapters = uploadCourseChapters;
const uploadAllCourseTasksView = async ({ courseid, allTasksAndGuidesWithLevels, }) => {
    try {
        const allTasksNoGuides = allTasksAndGuidesWithLevels.filter((task) => task.tasktype == const_1.TT.task);
        await (0, CA_1.setDocInCollection)({
            collectionName: const_1.CLT.newtasks,
            data: {},
            id: courseid,
        });
        await (0, CA_1.setDocInSubCollection)({
            collectionName: const_1.CLT.newtasks,
            id: courseid,
            subCollectionName: const_1.CLT.chapters,
            subId: fbconfig_1.D.ALLTASKS_DOC_ID,
            data: {
                tasks: allTasksNoGuides,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.uploadAllCourseTasksView = uploadAllCourseTasksView;
const uploadChapterTasks = async ({ courseid, chapterid, chapterTasks, }) => {
    try {
        await (0, CA_1.setDocInSubCollection)({
            collectionName: const_1.CLT.newtasks,
            id: courseid,
            subCollectionName: const_1.CLT.chapters,
            subId: chapterid,
            data: {
                tasks: chapterTasks,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.uploadChapterTasks = uploadChapterTasks;
const uploadCourseChaptersObject = async (chapterCourseObjectModel) => {
    try {
        await (0, CA_1.setDocInCollection)({
            collectionName: const_1.CLT.views,
            data: chapterCourseObjectModel,
            id: fbconfig_1.D.CHAPTER_OBJ_VIEW_ID,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.uploadCourseChaptersObject = uploadCourseChaptersObject;
//course
const getFlowDB = async ({ courseid }) => {
    try {
        const flowDB = await (0, CA_1.getDocDataFromCollectionById)({
            collectionName: const_1.CLT.chapters,
            id: courseid,
        });
        return flowDB;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getFlowDB = getFlowDB;
const getChapterIds_admin = async ({ courseid, }) => {
    try {
        const flowDB = await (0, exports.getFlowDB)({ courseid });
        return (0, ETLadmin_1.extractChapterIdsOnly_admin)(flowDB.nodes);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getChapterIds_admin = getChapterIds_admin;
//groups
const getGroupsArr = async (userid) => {
    const groups = await (0, CA_1.getDocDataFromCollectionById)({
        collectionName: const_1.CLT.groups,
        id: userid,
    });
    try {
        const data = (0, ETLGroups_1.groupsObjectToArr)(groups || {});
        return data;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getGroupsArr = getGroupsArr;
const getChaptersObjdata = async () => {
    try {
        const chaptersObj = await (0, CA_1.getDocDataFromCollectionById)({
            collectionName: const_1.CLT.views,
            id: fbconfig_1.D.CHAPTER_OBJ_VIEW_ID,
        });
        return chaptersObj || {};
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getChaptersObjdata = getChaptersObjdata;
const addNewGroupDB = async (groupid, groupdata, uuid) => {
    try {
        await (0, CA_1.updateDocByid)({
            collectionName: const_1.CLT.groups,
            id: uuid,
            data: {
                [`${groupid}`]: groupdata,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.addNewGroupDB = addNewGroupDB;
const updateNodeLabelDB = async (data, userid) => {
    try {
        await (0, CA_1.setDocInCollection)({
            collectionName: const_1.CLT.groups,
            data: (0, ETLGroups_1.groupsArrToObject)(data),
            id: userid,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.updateNodeLabelDB = updateNodeLabelDB;
const addUserToGroup = async ({ groupid, secondName, firstName, manager, uid, }) => {
    try {
        const user = {
            uid,
            label: `${secondName} ${firstName}`,
            isFolder: false,
            children: {},
        };
        await (0, CA_1.updateDocByid)({
            collectionName: const_1.CLT.groups,
            id: manager,
            data: {
                [`${groupid}.children.${groupid + uid}`]: user,
            },
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.addUserToGroup = addUserToGroup;
// pivot
const saveSnapshot = ({ userid, groupid, userMetaObj, }) => {
    try {
        (0, CA_1.setDocInSubCollection)({
            collectionName: const_1.CLT.snapshots,
            id: userid,
            subCollectionName: const_1.CLT.snapshot,
            subId: groupid,
            data: userMetaObj,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.saveSnapshot = saveSnapshot;
const getSnapShot = async ({ groupid, userid, }) => {
    try {
        const snapshot = await (0, CA_1.getDocDataFromSubCollectionById)({
            collectionName: const_1.CLT.snapshots,
            id: userid,
            subCollectionName: const_1.CLT.snapshot,
            subId: groupid,
        });
        return snapshot ?? {};
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getSnapShot = getSnapShot;
const getUsersMetaObj = async (uids) => {
    try {
        const usersMeta = await (0, CA_1.getMultipleDocs)({
            collectionName: const_1.CLT.usermeta,
            ids: uids,
        });
        return (0, ETLPivot_1.extractUsersMetaObj)(usersMeta);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getUsersMetaObj = getUsersMetaObj;
const getAllTasksDataObj = async (courseid) => {
    try {
        const allTasks = await (0, CA_1.getDocDataFromSubCollectionById)({
            collectionName: const_1.CLT.newtasks,
            id: courseid,
            subCollectionName: const_1.CLT.chapters,
            subId: fbconfig_1.D.ALLTASKS_DOC_ID,
        });
        return (0, ETLPivot_1.allTasksArrToObj)(allTasks?.tasks);
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getAllTasksDataObj = getAllTasksDataObj;
//taskset
const getAllTasksFromChapter = async ({ chapterid, courseid, }) => {
    try {
        const tasks = await (0, CA_1.getDocDataFromSubCollectionById)({
            collectionName: const_1.CLT.newtasks,
            id: courseid,
            subCollectionName: const_1.CLT.chapters,
            subId: chapterid,
        });
        return !tasks ? [] : tasks.tasks;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getAllTasksFromChapter = getAllTasksFromChapter;
const getTextBookTasks = async ({ completed, courseid, }) => {
    try {
        const tasks = await (0, CA_1.getDocDataFromSubCollectionById)({
            collectionName: const_1.CLT.newtasks,
            id: courseid,
            subCollectionName: const_1.CLT.chapters,
            subId: fbconfig_1.D.TEXT_BOOK_TASKS_ID,
        });
        const unlockedTheory = tasks?.tasks.filter((task) => completed.includes(task.chapterparentid));
        if (!tasks) {
            return [];
        }
        return unlockedTheory;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getTextBookTasks = getTextBookTasks;
const getAllCourseTasks = async (courseid) => {
    try {
        const allTasks = await (0, CA_1.getDocDataFromSubCollectionById)({
            collectionName: const_1.CLT.newtasks,
            id: courseid,
            subCollectionName: const_1.CLT.chapters,
            subId: fbconfig_1.D.ALLTASKS_DOC_ID,
        });
        return allTasks?.tasks;
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getAllCourseTasks = getAllCourseTasks;
//usermeta
const getUserMetaDataCA = async (uid) => {
    try {
        const userMeta = await (0, CA_1.getDocDataFromCollectionById)({
            collectionName: const_1.CLT.usermeta,
            id: uid,
        });
        return userMeta || {};
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.getUserMetaDataCA = getUserMetaDataCA;
const createNewUserMeta = async ({ userId, data, }) => {
    try {
        await (0, CA_1.setDocInCollection)({
            collectionName: const_1.CLT.usermeta,
            data,
            id: userId,
        });
    }
    catch (error) {
        throw (0, errorHandlers_1.throwInnerError)(error);
    }
};
exports.createNewUserMeta = createNewUserMeta;
//# sourceMappingURL=repositoryFBCA.js.map