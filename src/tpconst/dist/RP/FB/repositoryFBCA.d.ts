import { ChampDB, ChampuserDB, TaskDB, TasksLogDB, CourseChapterObjDB, EdgeDB, FlowDB, NodeDB, GroupArr, GroupUserDBAttrs, UserMetaDB, UsersMetaReportDB, completedChapters, GuideDB, Task } from "../../T";
export declare const updateChampPoints: ({ pts, champid, userid, }: {
    pts: number;
    champid: string;
    userid: string;
}) => Promise<void>;
export declare const saveChampUserTaskLog: ({ tasklog, champid, userid, }: {
    tasklog: TasksLogDB;
    champid: string;
    userid: string;
}) => void;
export declare const getChampTasksDB: ({ champid }: {
    champid: string;
}) => Promise<TaskDB[]>;
export declare const subscribeOnChamp: ({ champid, action, duration, }: {
    champid: string;
    action: (docdata: ChampDB) => void;
    duration: number;
}) => Promise<void>;
export declare const updateUserInChamp: ({ champuserdata, champid, userid, }: {
    champuserdata: ChampuserDB;
    champid: string;
    userid: string;
}) => Promise<void>;
export declare const getUserChampStatus: ({ userid, champid, }: {
    champid: string;
    userid: string;
}) => Promise<import("../../T").Persstatus>;
export declare const createNewChamp: ({ tasks, champid, }: {
    champid: string;
    tasks: TaskDB[];
}) => Promise<void>;
export declare const setChampStarted: ({ champid }: {
    champid: string;
}) => Promise<void>;
export declare const uploadCourseChapters: ({ nodes, edges, courseid, }: {
    nodes: NodeDB[];
    edges: EdgeDB[];
    courseid: string;
}) => Promise<void>;
export declare const uploadAllCourseTasksView: ({ courseid, allTasksAndGuidesWithLevels, }: {
    courseid: string;
    allTasksAndGuidesWithLevels: TaskDB[];
}) => Promise<void>;
export declare const uploadChapterTasks: ({ courseid, chapterid, chapterTasks, }: {
    courseid: string;
    chapterid: string;
    chapterTasks: TaskDB[];
}) => Promise<void>;
export declare const uploadCourseChaptersObject: (chapterCourseObjectModel: CourseChapterObjDB) => Promise<void>;
export declare const getFlowDB: ({ courseid }: {
    courseid: string;
}) => Promise<FlowDB>;
export declare const getChapterIds_admin: ({ courseid, }: {
    courseid: string;
}) => Promise<string[]>;
export declare const getGroupsArr: (userid: string) => Promise<{
    id: string;
    label: string;
    isFolder: boolean;
    uid: string;
    children: {
        id: string;
        label: string;
        isFolder: boolean;
        uid: string;
        children: never[];
    }[];
}[]>;
export declare const getChaptersObjdata: () => Promise<CourseChapterObjDB>;
export declare const addNewGroupDB: (groupid: string, groupdata: GroupUserDBAttrs, uuid: string) => Promise<void>;
export declare const updateNodeLabelDB: (data: GroupArr[], userid: string) => Promise<void>;
export declare const addUserToGroup: ({ groupid, secondName, firstName, manager, uid, }: {
    groupid: string;
    secondName: string;
    firstName: string;
    manager: string;
    uid: string;
}) => Promise<void>;
export declare const saveSnapshot: ({ userid, groupid, userMetaObj, }: {
    userid: string;
    groupid: string;
    userMetaObj: UsersMetaReportDB;
}) => void;
export declare const getSnapShot: ({ groupid, userid, }: {
    groupid: string;
    userid: string;
}) => Promise<UsersMetaReportDB>;
export declare const getUsersMetaObj: (uids: string[]) => Promise<UsersMetaReportDB>;
export declare const getAllTasksDataObj: (courseid: string) => Promise<import("../../T").RawTaskObj>;
export declare const getAllTasksFromChapter: ({ chapterid, courseid, }: {
    chapterid: string;
    courseid: string;
}) => Promise<import("../../T").UnitDB[]>;
export declare const getTextBookTasks: ({ completed, courseid, }: {
    completed: completedChapters;
    courseid: string;
}) => Promise<GuideDB[]>;
export declare const getAllCourseTasks: (courseid: string) => Promise<Task[]>;
export declare const getUserMetaDataCA: (uid: string) => Promise<UserMetaDB>;
export declare const createNewUserMeta: ({ userId, data, }: {
    userId: string;
    data: UserMetaDB;
}) => Promise<void>;
//# sourceMappingURL=repositoryFBCA.d.ts.map