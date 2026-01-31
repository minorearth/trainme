"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eqArrays = void 0;
//confirm any
const eqArrays = (a, b) => {
    return (a.every((val, idx) => val === b[idx]) &&
        b.every((val, idx) => val === a[idx]));
};
exports.eqArrays = eqArrays;
//# sourceMappingURL=arrUtils.js.map