"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTasksArrToObj = exports.extractUsersMetaObj = void 0;
const extractUsersMetaObj = (usersMeta) => {
    const res = usersMeta.reduce((acc, user) => ({
        ...acc,
        [user.userId]: getCourseChapters(user.courses),
    }), {});
    return res;
};
exports.extractUsersMetaObj = extractUsersMetaObj;
const getCourseChapters = (courses) => {
    const res = Object.keys(courses).reduce((acc, courseid) => ({
        ...acc,
        [courseid]: {
            completed: courses[courseid].completed,
            stat: getChaptersData(courses[courseid].stat),
        },
    }), {});
    return res;
};
const getChaptersData = (chapters) => {
    return Object.keys(chapters).reduce((acc, chapterid) => ({
        ...acc,
        [chapterid]: { sum: chapters[chapterid].sum },
    }), {});
};
const allTasksArrToObj = (units) => {
    const alltasksObj = units.reduce((acc, unit) => ({
        ...acc,
        [unit.unituuid]: { task: unit.task, unitorder: unit.unitorder },
    }), {});
    return alltasksObj;
};
exports.allTasksArrToObj = allTasksArrToObj;
//# sourceMappingURL=ETLPivot.js.map