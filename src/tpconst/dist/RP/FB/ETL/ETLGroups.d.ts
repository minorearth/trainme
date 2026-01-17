import { GroupArr, GroupDB } from "../../../T";
export declare const groupsObjectToArr: (data: GroupDB) => {
    id: string;
    label: string;
    isFolder: boolean;
    uid: string;
    children: {
        id: string;
        label: string;
        isFolder: boolean;
        uid: string;
        children: never[];
    }[];
}[];
export declare const groupsArrToObject: (data: GroupArr[]) => {};
//# sourceMappingURL=ETLGroups.d.ts.map