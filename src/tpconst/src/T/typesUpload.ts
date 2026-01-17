import { TaskType } from "./typesBasic";
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
  taskuuid: string;
  tasktype: TaskType;
  defaultcode: string;
  rightcode: string;
  forbiddencode: string;
  defaultoutput: string[];
  taskorder: number;
}

export interface InOutDB {
  inv: string[];
  outv: string[];
}
