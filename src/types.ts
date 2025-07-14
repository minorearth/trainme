import { ChapterObjReport } from "./components/manager/types";

export interface TaskToUpload {
  chapterparentid: string;
  restrictions: {
    maxlines: number;
    musthave: string[];
    musthaveRe: string[];
    forbiddenRe: string[];
    forbidden: string[];
  };
  inout: RawInOut[];
  chapterid: string;
  task: string;
  taskuuid: string;
  tasktype: string;
  defaultcode: string;
  rightcode: string;
  forbiddencode: string;
  defaultoutput: string[];
  defaultinput: string[];
  id: number;
}

export type RawTask = TaskToUpload & { level: number };

export type AllCoursesRawTaskObj = {
  [courseid: string]: RawTaskObj;
};

export interface RawTaskObj {
  [uuid: string]: {
    task: string;
    id: number;
  };
}

export interface RawInOut {
  inv: string[];
  outv: string[];
}

export type InOut = RawInOut & { filesdata: string[] };

export type TaskWithFiles = Omit<RawTask, "inout"> & {
  inout: InOut[];
  filedata: string;
};

export type Task = TaskWithFiles & {
  tasktext: string;
};

export type TaskStage =
  | "recap"
  | "recap_suspended"
  | "WIP"
  | "accomplished_suspended";

export type TasksetMode = "champ" | "textbook" | "exam" | "addhoc" | "newtopic";

export type Page =
  | "testrun"
  | "flow"
  | "courses"
  | "champ"
  | "flowflow"
  | "lessonStarted"
  | "testrun"
  | "congrat";

export interface UserMeta {
  courses: UserCourses;
  userId: string;
  name: string;
  paidcourses: string[];
}

export interface UserCourses {
  [courseid: string]: CourseProgress;
}

export interface CourseProgress {
  completed: string[];
  rating: number;
  unlocked: string[];
  stat: CourseStat;
  paid: string[];
  lastunlocked: string[];
}

export interface CourseStat {
  [chapterid: string]: ChapterProgress;
}

export interface ChapterProgress {
  sum: number;
  tasks: TasksStat;
}

export interface TasksStat {
  [taskuid: string]: TaskStatAttrs;
}

export interface TaskStatAttrs {
  code: string;
  errorcode: string;
}

export interface TasksetState {
  tasksetmode: TasksetMode;
  recapTasksIds: number[];
  taskstage: TaskStage;
  pts?: number;
  tasklog?: any;
  randomsaved?: string[];
  fixed: number;
  success?: boolean;
}

export interface ChapterState {
  completed: boolean;
  overflow: boolean;
  chapterid: string;
  tobeunlocked: string[];
  remainsum: number;
  level: number;
}

export interface ChampState {
  champid: string;
}

export interface CourseState {
  courseid: string;
}

export interface NavigatorState {
  page: Page;
}

export type StateType =
  | "navigator"
  | "course"
  | "champ"
  | "chapter"
  | "taskset"
  | "user";

export interface CSP {
  navigator: NavigatorState;
  course: CourseState;
  champ: ChampState;
  chapter: ChapterState;
  taskset: TasksetState;
  user: { username: string; progress: CourseProgress };
  task: { currTaskId: number };
}

export type TasksetStateChapter = Required<TasksetState>;

export type TasksetStateChamp = Required<
  Pick<
    TasksetState,
    "tasksetmode" | "recapTasksIds" | "taskstage" | "pts" | "tasklog"
  >
>;

export interface Node {
  type: string;
  data: NodeData;
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export interface NodeData {
  title: string;
  //description
  subline: string;
  maxcoins: number;
  id: string;
  unlockpts: number | null;
  order: number;
  nodemode: "newtopic" | "addhoc" | "exam" | "animation";
  level: number;
  lottie: string;
  type: string;
}

export type EnrichedNode = Omit<Node, "data"> & { data: EnrichedNodeData };

export type EnrichedNodeData = NodeData & {
  unlocked: boolean;
  completed: boolean;
  paid: boolean;
  remainsum: number;
  tobeunlocked: string[];
  overflow: boolean;
  rating: number;
  sum: number;
  action: (data: EnrichedNodeData) => void;
};

export interface Edge {
  id: string;
  target: string;
  source: string;
}

export interface Champuser {
  name: string;
  pts: number;
  change: number;
  avatarid: number;
  uid: string;
  persstatus: string;
}

export type FieldType =
  | "firstname"
  | "secondname"
  | "champid"
  | "tasknum"
  | "nickname"
  | "email"
  | "password"
  | "name";

export interface CoursesToLoad {
  [courseid: string]: {
    chapterFlowNodes: Node[];
    chapterFlowNodesObj: ChapterObjReport;
    chapterFlowEdges: Edge[];
    tasksall: TaskToUpload[];
  };
}
