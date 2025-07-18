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
export type TaskDBWithFiles = Omit<TaskDB, "inout"> & {
  ///////////////////////////////////////////////////////////////
  inout: InOut[];
  filedata: string;
};

export type InOut = InOutDB & { filesdata: string[] };

export type Task = TaskDBWithFiles & {
  tasktext: string;
};

//Flow(enriched with progress)

export interface FlowState {
  nodes: NodeDBState[];
  edges: EdgeDB[];
}

export interface NodeDBState extends NodeDB {
  data: NodeDataState;
}

export type NodeDataState = NodeDataDB &
  // Pick<CourseProgressDB, "rating"> &
  Pick<ChapterProgressDB, "sum"> & {
    //calculated
    completed: boolean;
    unlocked: boolean;
    paid: boolean;
    tobeunlocked: string[];
    overflow: boolean;
    remainsum: number;

    action: (data: NodeDataState) => void;
  };

//Tasksetstate
export interface TasksetStatePersisted {
  tasksetmode: TasksetMode;
  recapTasksIds: number[];
  taskstage: TasksetStage;
  pts: number;
  tasklog: TasksLogDB;
  randomsaved: string[];
  fixed: number;
  //TODO: wtf?
  success: boolean;
  currTaskId: number;
}

export type TasksetStage =
  | "recap"
  | "recap_suspended"
  | "WIP"
  | "accomplished_suspended";

export type TasksetMode =
  | "champ"
  | "textbook"
  | "default"
  | Extract<NodeModes, "newtopic" | "addhoc" | "exam">;

//user
export type UserStatePersisted = {
  username: string;
  progress: CourseProgressDB;
};

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
