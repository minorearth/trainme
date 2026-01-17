"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractChapterIdsOnly_admin = void 0;
const extractChapterIdsOnly_admin = (chapterFlowNodes) => {
    return chapterFlowNodes.map((node) => node.id).filter((id) => id[0] != "-");
};
exports.extractChapterIdsOnly_admin = extractChapterIdsOnly_admin;
//# sourceMappingURL=ETLadmin.js.map