"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URT = exports.CLT = exports.SetDF = exports.GetDF = exports.STT = exports.CT = exports.ST = exports.CS = exports.TT = exports.TSM = exports.NM = exports.PG = exports.PS = exports.TS = void 0;
exports.TS = {
    recap: "recaps",
    recapSuspended: "recap_suspended",
    WIP: "WIP",
    accomplishedSuspended: "accomplished_suspended",
};
exports.PS = {
    champwip: "champwip",
    champisover: "champisover",
    joined: "joined",
    undefined: "undefined",
};
exports.PG = {
    testrun: "testrun",
    flow: "flow",
    courses: "courses",
    champ: "champ",
    lessonStarted: "lessonStarted",
    congrat: "congrat",
};
//refreesh all types in excel after editing
const newtopic = "newtopic";
const addhoc = "addhoc";
const exam = "exam";
exports.NM = {
    newtopic,
    addhoc,
    exam,
    animation: "animation",
};
exports.TSM = {
    newtopic,
    addhoc,
    exam,
    champ: "champ",
    textbook: "textbook",
    default: "default",
};
exports.TT = { guide: "guide", task: "task" };
exports.CS = { started: "started", created: "created" };
exports.ST = {
    success: "success",
    fail: "fail",
    undefined: "undefined",
};
exports.CT = { course: "course", champ: "champ" };
exports.STT = {
    navigator: "navigator",
    course: "course",
    champ: "champ",
    chapter: "chapter",
    taskset: "taskset",
    user: "user",
};
exports.GetDF = {
    getusermetadata: "getusermetadata",
    getuserCoursemetadata: "getuserCoursemetadata",
    checkcoursepaid: "checkcoursepaid",
    getpaymentid: "getpaymentid",
};
exports.SetDF = {
    paychapter: "paychapter",
    setProgress: "setprogress",
    setProgressDBFull: "setProgressDBFull",
};
exports.CLT = {
    champ: "champ",
    chapters: "chapters",
    groups: "groups",
    tasks: "tasks",
    newtasks: "newtasks",
    usermeta: "usermeta",
    views: "views",
    snapshots: "snapshots",
    snapshot: "snapshot",
};
exports.URT = {
    nottask: "nottask",
    task: "task",
};
//# sourceMappingURL=const.js.map