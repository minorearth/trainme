"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsArrToObject = exports.groupsObjectToArr = void 0;
const groupsObjectToArr = (data) => {
    const arr = Object.keys(data)
        .map((groupkey) => ({
        id: groupkey,
        label: data[groupkey].label,
        isFolder: data[groupkey].isFolder,
        uid: "",
        children: Object.keys(data[groupkey].children)
            .map((userkey) => ({
            id: userkey,
            label: data[groupkey].children[userkey].label,
            isFolder: data[groupkey].children[userkey].isFolder,
            uid: data[groupkey].children[userkey].uid,
            children: [],
        }))
            .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())),
    }))
        .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
    return arr;
};
exports.groupsObjectToArr = groupsObjectToArr;
const groupsArrToObject = (data) => {
    const obj = data.reduce((acc, item) => ({
        ...acc,
        [item.id]: {
            label: item.label,
            isFolder: item.isFolder,
            children: item.children.reduce((acc, child) => ({
                ...acc,
                [child.id]: {
                    label: child.label,
                    isFolder: child.isFolder,
                    uid: child.uid || NaN,
                },
            }), {}),
        },
    }), {});
    return obj;
};
exports.groupsArrToObject = groupsArrToObject;
//# sourceMappingURL=ETLGroups.js.map