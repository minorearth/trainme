"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETLUserProgress = void 0;
const ETLUserProgress = (data) => {
    const stat = Object.keys(data.stat).reduce((acc, chapterid) => ({
        ...acc,
        [chapterid]: {
            //TODO:(later)Tasks att missng is not detected by  typescript !?
            sum: data.stat[chapterid].sum,
        },
    }), {});
    return {
        ...data,
        stat,
    };
};
exports.ETLUserProgress = ETLUserProgress;
//# sourceMappingURL=ETLUserMeta.js.map