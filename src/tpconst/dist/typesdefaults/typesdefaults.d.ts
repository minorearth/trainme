export declare const UNIT_DEFAULTS: {
    unitorder: number;
    defaultcode: string;
    unituuid: string;
    inout: {
        outv: string[];
        inv: string[];
        filesdata: string[];
    }[];
    unittype: "task";
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
export declare const UNITSET_DEFAULTS: {
    unitsetmode: "default";
    recapTasksIds: never[];
    unitsetstage: "WIP";
    pts: number;
    tasklog: {};
    randomsaved: never[];
    fixed: number;
    success: "undefined";
    currUnitId: number;
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
    unitset: {
        unitsetmode: "default";
        recapTasksIds: never[];
        unitsetstage: "WIP";
        pts: number;
        tasklog: {};
        randomsaved: never[];
        fixed: number;
        success: "undefined";
        currUnitId: number;
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