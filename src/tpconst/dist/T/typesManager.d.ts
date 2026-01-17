import { GroupArr, GroupUserDBAttrs, NodeDataDB } from "./typesDB";
import { URT } from "../const/const";
export type ChapterArrReport = Pick<NodeDataDB, "maxcoins" | "order" | "id">;
export interface PivotReport {
    [courseid: string]: CoursePivotReport;
}
export interface CoursePivotReport {
    rows: {
        [col: string]: {
            completed: string;
            sum: number | string;
            maxcoins: string;
            id: string;
        };
    }[];
    cols: {
        header: string;
        accessor: string;
        order: number;
        maxcoins: number | string;
        title: string;
    }[];
}
export type UserReportType = (typeof URT)[keyof typeof URT];
export type UserReport = Pick<GroupArr, "id" | "label"> & {
    order: number;
    type: UserReportType;
    code: string;
    children: UserReport[];
};
export type GroupUserObjReportAttr = Pick<GroupUserDBAttrs, "label" | "uid">;
export type GroupUserObjReport = {
    [id: string]: GroupUserObjReportAttr;
};
export type AllCoursesRawTaskObj = {
    [courseid: string]: RawTaskObj;
};
export type RawTaskObj = {
    [uuid: string]: {
        task: string;
        taskorder: number;
    };
};
//# sourceMappingURL=typesManager.d.ts.map