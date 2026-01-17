import { CourseProgressDB, CourseStatDB } from "../../../T";
export declare const ETLUserProgress: (data: CourseProgressDB) => {
    stat: CourseStatDB;
    completed: import("../../../T").completedChapters;
    unlocked: string[];
    paid: string[];
    lastunlocked: string[];
    rating: number;
};
//# sourceMappingURL=ETLUserMeta.d.ts.map