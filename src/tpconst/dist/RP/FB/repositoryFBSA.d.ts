import { CourseProgressDB, UserMetaDB } from "../../T";
export declare function resetUser(dataEncrypted: string): Promise<void>;
export declare const unlockAllChaptersDBSA: (dataEncrypted: string) => Promise<void>;
export declare const completeAllChaptersDBSA: (dataEncrypted: string) => Promise<void>;
export declare const setMoneyDBSA: (dataEncrypted: string) => Promise<void>;
export declare const paychapterDBSA: ({ dataEncrypted, }: {
    dataEncrypted: string;
}) => Promise<void>;
export declare const saveProgressDBSAFull: ({ dataEncrypted, }: {
    dataEncrypted: string;
}) => Promise<void>;
export declare const saveProgressDBSA: ({ dataEncrypted, }: {
    dataEncrypted: string;
}) => Promise<void>;
export declare const buyCourseDBSA: ({ uid, courseid, }: {
    uid: string;
    courseid: string;
}) => Promise<void>;
export declare const getUserMetaDBSA: (id: string) => Promise<UserMetaDB>;
export declare const getPaymentIdDBSA: (data: string) => Promise<any>;
export declare const getUserCourseMetaDBSA: (id: string, courseid: string) => Promise<CourseProgressDB>;
export declare const checkCoursePaidDBSA: (courseid: string, uid: string) => Promise<boolean>;
//# sourceMappingURL=repositoryFBSA.d.ts.map