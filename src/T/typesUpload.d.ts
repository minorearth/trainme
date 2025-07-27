import { TaskType } from "./typesBasic";
import { ChapterObjReportDB, EdgeDB, NodeDB } from "./typesDB";

//////////////////////////upload(admin)
//Task
export interface CoursesDataToUpload {
  [courseid: string]: {
    chapterFlowNodes: NodeDB[];
    chapterFlowNodesObj: ChapterObjReportDB;
    chapterFlowEdges: EdgeDB[];
    tasksall: RawTaskToUploadWithoutLevel[];
  };
}

export interface RawTaskToUploadWithoutLevel {
  chapterparentid: string;
  restrictions: {
    maxlines: number;
    musthave: string[];
    musthaveRe: string[];
    forbiddenRe: string[];
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
  defaultinput: string[];
  id: number;
}

export interface InOutDB {
  inv: string[];
  outv: string[];
}
