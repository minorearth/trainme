import { UnitType } from "./typesBasic";
import { ChapterObjReportDB, EdgeDB, NodeDB } from "./typesDB";

//////////////////////////upload(admin)
//Task
export interface CoursesDataToUpload {
  [courseid: string]: {
    nodes: NodeDB[];
    chapterFlowNodesObj: ChapterObjReportDB;
    edges: EdgeDB[];
    tasksall: RawTaskToUploadWithoutLevel[];
    skipupload: boolean;
    specificchapters: string[];
  };
}

export interface RawTaskToUploadWithoutLevel {
  chapterparentid: string;
  restrictions: {
    maxlines: number;
    musthave: string[];
    forbidden: string[];
  };
  inout: InOutDB[];
  chapterid: string;
  task: string;
  unituuid: string;
  unittype: UnitType;
  defaultcode: string;
  rightcode: string;
  forbiddencode: string;
  defaultoutput: string[];
  unitorder: number;
}

export interface Guidepart {
  inout: { inv: string[] }[];
  part: string;
}

export interface RawGuideToUpload extends Omit<
  RawTaskToUploadWithoutLevel,
  "inout" | "restrictions" | "task" | "rightcode" | "forbiddencode"
> {
  parts: Guidepart[];
  inout: { inv: string[] }[];
}

export interface InOutDB {
  inv: string[];
  outv: string[];
}
