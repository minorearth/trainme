"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskLogToDBFormat = void 0;
const taskLogToDBFormat = ({ courseid, lastcompleted, tasklog, }) => {
    //confirm any and as WIP
    let res = {};
    const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
    Object.keys(tasklog).forEach((taskuuid) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid]));
    return res;
};
exports.taskLogToDBFormat = taskLogToDBFormat;
//# sourceMappingURL=ETLTaskset.js.map