import {
  ChapterProgressDB,
  CourseProgressDB,
  CoursesDB,
  EdgeDB,
  NodeDataDB,
  NodeDB,
  NodeModes,
  TaskDB,
  TasksLogDB,
} from "./typesDB";
import { InOutDB } from "./typesUpload";

//////////////////////////State
export type StateType =
  | "navigator"
  | "course"
  | "champ"
  | "chapter"
  | "taskset"
  | "user";

//Task
export interface TaskDBWithFiles extends TaskDB {
  ///////////////////////////////////////////////////////////////
  inout: InOutWithFilesDataState[];
  filedata: string;
}

export interface InOutWithFilesDataState extends InOutDB {
  filesdata: string[];
}

export interface Task extends TaskDBWithFiles {
  tasktext: string;
}

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

export type SuccessType = "success" | "fail" | "indefined";

export const TS = {
  recap: "recap" as const,
  recapSuspended: "recap_suspended" as const,
  WIP: "WIP",
  accomplishedSuspended: "accomplished_suspended" as const,
} as const;

export type TasksetStage = (typeof TS)[keyof typeof TS];

export type TasksetMode =
  | "champ"
  | "textbook"
  | "default"
  | Extract<NodeModes, "newtopic" | "addhoc" | "exam">;

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

export type Page =
  | "testrun"
  | "flow"
  | "courses"
  | "champ"
  | "flowflow"
  | "lessonStarted"
  | "testrun"
  | "congrat";
