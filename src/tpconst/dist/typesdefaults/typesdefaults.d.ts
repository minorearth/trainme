export declare const TASK_DEFAULTS: {
    taskorder: number;
    defaultcode: string;
    taskuuid: string;
    inout: {
        outv: string[];
        inv: string[];
        filesdata: string[];
    }[];
    tasktype: "task";
    level: number;
    restrictions: {
        musthave: string[];
        maxlines: number;
        musthaveRe: string[];
        forbidden: string[];
        forbiddenRe: never[];
    };
    task: string;
    forbiddencode: string;
    defaultoutput: string[];
    defaultinput: string[];
    rightcode: string;
    chapterparentid: string;
    chapterid: string;
    tasktext: string;
    filedata: string;
};
export declare const CHAPTER_DEFAULTS: {
    chapterid: string;
    level: number;
    tobeunlocked: never[];
    remainsum: number;
    completed: boolean;
    overflow: boolean;
};
export declare const CHAMP_DEFAULTS: {
    champid: string;
};
export declare const COURSE_DEFAULTS: {
    courseid: string;
};
export declare const NAVIGATOR_DEFAULTS: {
    page: "courses";
};
export declare const TASKSET_DEFAULTS: {
    tasksetmode: "default";
    recapTasksIds: never[];
    taskstage: "WIP";
    pts: number;
    tasklog: {};
    randomsaved: never[];
    fixed: number;
    success: "undefined";
    currTaskId: number;
};
export declare const USERPROGRESS_DEFAULTS: {
    completed: never[];
    rating: number;
    unlocked: never[];
    stat: {};
    paid: never[];
    lastunlocked: never[];
};
export declare const CHAMPUSER_DEFAULTS: {
    name: string;
    pts: number;
    change: number;
    avatarid: number;
};
export declare const CSP_DEFAULTS: {
    navigator: {
        page: "courses";
    };
    course: {
        courseid: string;
    };
    champ: {
        champid: string;
    };
    chapter: {
        chapterid: string;
        level: number;
        tobeunlocked: never[];
        remainsum: number;
        completed: boolean;
        overflow: boolean;
    };
    taskset: {
        tasksetmode: "default";
        recapTasksIds: never[];
        taskstage: "WIP";
        pts: number;
        tasklog: {};
        randomsaved: never[];
        fixed: number;
        success: "undefined";
        currTaskId: number;
    };
    user: {
        username: string;
        progress: {
            completed: never[];
            rating: number;
            unlocked: never[];
            stat: {};
            paid: never[];
            lastunlocked: never[];
        };
    };
};
//# sourceMappingURL=typesdefaults.d.ts.map