"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSP_DEFAULTS = exports.CHAMPUSER_DEFAULTS = exports.USERPROGRESS_DEFAULTS = exports.UNITSET_DEFAULTS = exports.NAVIGATOR_DEFAULTS = exports.COURSE_DEFAULTS = exports.CHAMP_DEFAULTS = exports.CHAPTER_DEFAULTS = exports.UNIT_DEFAULTS = void 0;
const const_1 = require("../const/const");
exports.UNIT_DEFAULTS = {
    unitorder: -1,
    defaultcode: "",
    unituuid: "",
    inout: [
        {
            outv: [""],
            inv: [""],
            filesdata: [""],
        },
    ],
    unittype: const_1.TT.task,
    level: -1,
    restrictions: {
        musthave: [""],
        maxlines: 1,
        musthaveRe: [""],
        forbidden: [""],
        forbiddenRe: [],
    },
    task: "loading",
    forbiddencode: "",
    defaultoutput: [""],
    defaultinput: [""],
    rightcode: "",
    chapterparentid: "",
    chapterid: "",
    tasktext: "",
    filedata: "",
};
exports.CHAPTER_DEFAULTS = {
    chapterid: "",
    level: -1,
    tobeunlocked: [],
    remainsum: -1,
    completed: false,
    overflow: false,
};
exports.CHAMP_DEFAULTS = {
    champid: "",
};
exports.COURSE_DEFAULTS = {
    courseid: "",
};
exports.NAVIGATOR_DEFAULTS = {
    page: const_1.PG.courses,
};
exports.UNITSET_DEFAULTS = {
    unitsetmode: const_1.TSM.default,
    recapTasksIds: [],
    unitsetstage: const_1.TS.WIP,
    pts: 0,
    tasklog: {},
    randomsaved: [],
    fixed: 0,
    success: const_1.ST.undefined,
    currUnitId: -1,
};
exports.USERPROGRESS_DEFAULTS = {
    completed: [],
    rating: -1,
    unlocked: [],
    stat: {},
    paid: [],
    lastunlocked: [],
};
exports.CHAMPUSER_DEFAULTS = {
    name: "",
    pts: 0,
    change: 0,
    avatarid: -1,
};
exports.CSP_DEFAULTS = {
    navigator: exports.NAVIGATOR_DEFAULTS,
    course: exports.COURSE_DEFAULTS,
    champ: exports.CHAMP_DEFAULTS,
    chapter: exports.CHAPTER_DEFAULTS,
    unitset: exports.UNITSET_DEFAULTS,
    user: { username: "", progress: exports.USERPROGRESS_DEFAULTS },
};
//# sourceMappingURL=typesdefaults.js.map