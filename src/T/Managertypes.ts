import {
  ChapterProgressDB,
  CourseProgressDB,
  GroupArr,
  GroupUserDBAttrs,
  NodeDataDB,
} from "@/T/typesDB";

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

export type UserReportType = "nottask|task";

export type UserReport = Pick<GroupArr, "id" | "label"> & {
  order: number;
  type: UserReportType;
  code: string;
  children: UserReport[];
};

//For report purposes

export type GroupUserObjReportAttr = Pick<GroupUserDBAttrs, "label" | "uid">;

export type GroupUserObjReport = {
  [id: string]: GroupUserObjReportAttr;
};

export type AllCoursesRawTaskObj = {
  [courseid: string]: RawTaskObj;
};

export interface RawTaskObj {
  [uuid: string]: {
    task: string;
    id: number;
  };
}
