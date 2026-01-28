import { Page, SuccessType, TasksetMode, TasksetStage } from "./typesBasic";
import {
  ChapterProgressDB,
  CourseProgressDB,
  CoursesDB,
  EdgeDB,
  GuideDB,
  NodeDataDB,
  NodeDB,
  TaskDB,
  TasksLogDB,
  UnitDB,
} from "./typesDB";
import { InOutDB } from "./typesUpload";

//////////////////////////State

//Task
export interface TaskDBWithFiles extends TaskDB {
  inout: InOutWithFilesDataState[];
  filedata: string;
}

export interface GuideDBWithFiles extends GuideDB {
  inout: InOutWithFilesDataState[];
  filedata: string;
}

export interface InOutWithFilesDataState extends InOutDB {
  filesdata: string[];
}

export interface Task extends TaskDBWithFiles {
  tasktext: string;
}

export interface Guide extends GuideDBWithFiles {}

export type Unit = Task | Guide;

// export interface Guide extends Omit<
//   TaskDBWithFiles,
//   "inout" | "restrictions" | "level" | "task" | "rightcode" | "forbiddencode"
// > {
//   parts: Guidepart[];
// }

//Flow(enriched with progress)

export interface FlowState {
  nodes: NodeDBState[];
  edges: EdgeDB[];
}

export interface NodeDBState extends NodeDB {
  data: NodeDataState;
}

export interface NodeDataState extends NodeDataDB {
  sum: ChapterProgressDB["sum"];
  //calculated
  completed: boolean;
  unlocked: boolean;
  paid: boolean;
  tobeunlocked: string[];
  overflow: boolean;
  remainsum: number;

  action: (data: NodeDataState) => void;
}

//Tasksetstate
export interface TasksetStatePersisted {
  tasksetmode: TasksetMode;
  recapTasksIds: number[];
  taskstage: TasksetStage;
  pts: number;
  tasklog: TasksLogDB;
  randomsaved: string[];
  fixed: number;
  success: SuccessType;
  currTaskId: number;
}

//user
export interface UserStatePersisted {
  username: string;
  progress: CourseProgressDB;
}

//chapter

export type ChapterStatePersisted = Pick<
  NodeDataState,
  "completed" | "overflow" | "tobeunlocked" | "level" | "remainsum"
> & { chapterid: NodeDataState["id"] };

//champ
export interface ChampStatePersisted {
  champid: string;
}

//course
export type CourseStatePersisted = Pick<CoursesDB, "courseid">;

//navigator
export interface NavigatorStatePersisted {
  page: Page;
}
