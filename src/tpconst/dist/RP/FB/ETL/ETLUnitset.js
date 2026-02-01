"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskLogToDBFormat = void 0;
const taskLogToDBFormat = ({ courseid, lastcompleted, tasklog, }) => {
    //confirm any and as WIP
    let res = {};
    const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
    Object.keys(tasklog).forEach((unituuid) => (res[`${dest}.${unituuid}`] = tasklog[unituuid]));
    return res;
};
exports.taskLogToDBFormat = taskLogToDBFormat;
//# sourceMappingURL=ETLUnitset.js.map