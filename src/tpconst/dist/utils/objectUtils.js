"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyBySubKeyValue = exports.getKeyValues = exports.flipObject = exports.ObjtoArr = void 0;
//confirm any
const ObjtoArr = (obj) => {
    return !obj
        ? []
        : Object.keys(obj).map((key) => {
            return {
                ...obj[key],
            };
        });
};
exports.ObjtoArr = ObjtoArr;
//confirm any
const flipObject = (obj) => {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        ret[obj[key]] = key;
    });
    return ret;
};
exports.flipObject = flipObject;
//confirm any
const getKeyValues = (obj) => {
    return Object.keys(obj).map((key) => obj[key]);
};
exports.getKeyValues = getKeyValues;
//confirm any
const getKeyBySubKeyValue = (obj, subkey, value) => {
    return Object.keys(obj).filter((key) => obj[key][subkey] == value)[0];
};
exports.getKeyBySubKeyValue = getKeyBySubKeyValue;
//# sourceMappingURL=objectUtils.js.map