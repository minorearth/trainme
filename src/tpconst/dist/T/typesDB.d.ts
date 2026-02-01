import { Champstatus, CourseType, NodeModes, Persstatus } from "./typesBasic";
import { ChampStatePersisted, ChapterStatePersisted, CourseStatePersisted, NavigatorStatePersisted, UnitsetStatePersisted, UserStatePersisted } from "./typesState";
import { RawGuideToUpload, RawTaskToUploadWithoutLevel } from "./typesUpload";
import { CLT } from "../const/const";
export type Subcollection = {};
export interface CollectionWrite<T> extends CollectionRead {
    data: T;
}
export interface CollectionRead {
    id: string;
    collectionName: CollectonsTypes;
}
export interface SubCollectionRead extends CollectionRead {
    subId: string;
    subCollectionName: CollectonsTypes;
}
export interface SubCollectionWrite<T> extends CollectionWrite<T> {
    subId: string;
    subCollectionName: CollectonsTypes;
}
export type CollectonsTypes = (typeof CLT)[keyof typeof CLT];
export type DBFormats = CoursesDBObj | UnitDBWraper | FlowDB | ChampDB | UserMetaDB | GroupDB | UsersMetaReportDB | CourseChapterObjDB | TaskDBWraper | GuideDBWraper;
export type FlowDB = {
    nodes: NodeDB[];
    edges: EdgeDB[];
};
export type NodeDB = {
    type: string;
    data: NodeDataDB;
    id: string;
    position: {
        x: number;
        y: number;
    };
};
export interface NodeDataDB extends Record<string, unknown> {
    title: string;
    subline: string;
    maxcoins: number;
    id: chapterid;
    unlockpts: number | null;
    order: number;
    nodemode: NodeModes;
    level: number;
    lottie: string;
    type: string;
}
export type chapterid = string;
export interface EdgeDB {
    id: string;
    target: string;
    source: string;
}
export interface UnitDBWraper {
    units: UnitDB[];
}
export interface GuideDBWraper {
    guides: GuideDB[];
}
export interface TaskDBWraper {
    tasks: TaskDB[];
}
export type UnitDB = TaskDB | GuideDB;
export interface TaskDB extends Omit<RawTaskToUploadWithoutLevel, "restrictions"> {
    level: number;
    restrictions: {
        maxlines: number;
        musthave: string[];
        forbidden: string[];
    };
}
export interface GuideDB extends RawGuideToUpload {
}
export interface ChampDB {
    status: Champstatus;
    users: {
        [userid: string]: ChampuserDB;
    };
    tasks: TaskDB[];
}
export interface ChampuserDB {
    name: string;
    pts: number;
    change: number;
    avatarid: number;
    uid: string;
    persstatus: Persstatus;
}
export interface UserMetaDB {
    courses: UserCoursesDB;
    userId: string;
    name: UserName;
    paidcourses: string[];
    paidcourses2: {
        [courseid: string]: boolean;
    };
}
export type UserName = string;
export interface UserCoursesDB {
    [courseid: string]: CourseProgressDB;
}
export interface CourseProgressDB {
    completed: completedChapters;
    unlocked: string[];
    stat: CourseStatDB;
    paid: string[];
    lastunlocked: string[];
    rating: number;
}
export type completedChapters = string[];
export interface CourseStatDB {
    [chapterid: string]: ChapterProgressDB;
}
export interface ChapterProgressDB {
    sum: number;
    tasks: TasksLogDB;
}
export interface TasksLogDB {
    [taskuid: string]: TaskLogAttrsDB;
}
export interface TaskLogAttrsDB {
    code: string;
    errorcode: string;
}
export interface CSP {
    navigator: NavigatorStatePersisted;
    course: CourseStatePersisted;
    champ: ChampStatePersisted;
    chapter: ChapterStatePersisted;
    unitset: UnitsetStatePersisted;
    user: UserStatePersisted;
}
export interface CoursesDBObj {
    [courseid: string]: CourseAttsDB;
}
export interface CoursesDB extends CourseAttsDB {
    courseid: string;
}
export interface CourseAttsDB {
    title: string;
    text: string;
    firstchapter: string;
    completed: boolean;
    type: CourseType;
    order: number;
    free: boolean;
    coursesAction: () => void;
}
export type GroupDB = {
    [id: string]: GroupUserDBAttrs;
};
export type GroupUserDBAttrs = {
    label: string;
    isFolder: boolean;
    children: GroupDB;
    uid: string;
};
export type GroupArr = {
    id: string;
    children: GroupArr[];
} & Pick<GroupUserDBAttrs, "label" | "isFolder" | "uid">;
export interface UsersMetaReportDBWrapper {
    usersMetaObj: UsersMetaReportDB;
}
export interface UsersMetaReportDB {
    [userId: string]: UserCoursesReportDB;
}
export interface UserCoursesReportDB {
    [courseid: string]: UserCoursesReportDBAttrs;
}
export type UserCoursesReportDBAttrs = Pick<CourseProgressDB, "completed"> & {
    stat: CourseStatReportDB;
};
export interface CourseStatReportDB {
    [chapterid: string]: Pick<ChapterProgressDB, "sum">;
}
export type CourseChapterObjDB = {
    [courseid: string]: ChapterObjReportDB;
};
export interface ChapterObjReportDB {
    [chapterid: string]: Pick<NodeDataDB, "maxcoins" | "nodemode" | "order" | "title">;
}
//# sourceMappingURL=typesDB.d.ts.map