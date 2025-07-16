import { CourseProgress, ChapterProgress, NodeData } from "@/types";

export interface UsersMetaReport {
  [userId: string]: UserCoursesReport;
}

export interface UserCoursesReport {
  [courseid: string]: UserCoursesReportAttrs;
}

export type UserCoursesReportAttrs = Pick<CourseProgress, "completed"> & {
  stat: CourseStatReport;
};

export interface CourseStatReport {
  [chapterid: string]: Pick<ChapterProgress, "sum">;
}

export interface ChapterObjReport {
  [chapterid: string]: Pick<
    NodeData,
    "maxcoins" | "nodemode" | "order" | "title"
  >;
}
export type ChapterArrReport = Pick<NodeData, "maxcoins" | "order" | "id">;

export interface CourseChapterObjReport {
  [courseid: string]: ChapterObjReport;
}

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

export interface Group {
  id: string;
  label: string;
  isFolder: boolean;
  children: GroupUser[];
  uid: string;
}

export type GroupUser = Group;

export type UserReport = Pick<Group, "id" | "label"> & {
  order: number;
  type: string;
  code: string;
  children: UserReport[];
};

export interface GroupObj {
  [id: string]: Omit<Group, "id" | "children"> & {
    children: GroupUserObj;
  };
}
export type GroupUserObjAttrs = Omit<GroupUser, "id">;

//For report purposes
export type GroupUserObj = {
  [id: string]: GroupUserObjAttrs;
};

export type GroupUserObjReportAttr = Pick<GroupUserObjAttrs, "label" | "uid">;

export type GroupUserObjReport = {
  [id: string]: GroupUserObjReportAttr;
};
