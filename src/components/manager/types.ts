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
