export interface RawTask {
  chapterparentid: string;
  restrictions: {
    maxlines: number;
    musthave: string[];
    musthaveRe: string[];
    forbiddenRe: string[];
    forbidden: string[];
  };
  inout: {
    inv: string[];
    outv: string[];
  }[];
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
  level: number;
}

type WithoutId = Omit<RawTask, "inout">;

export type Task = WithoutId & {
  inout: {
    filesdata: string[];
    inv: string[];
    outv: string[];
  }[];
  tasktext: string;
  filedata: string;
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

export interface UserProgress {
  completed: any;
  rating: any;
  unlocked: any;
  stat: any;
  paid: string[];
}

export interface TasksetState {
  tasksetmode: TasksetMode;
  recapTasksIds?: number[];
  taskstage: TaskStage;
  pts?: number;
  tasklog?: any;
  randomsaved?: string[];
  fixed?: number;
  success?: boolean;
}

export interface ChapterState {
  completed?: boolean;
  overflow?: boolean;
  chapterid: string;
  tobeunlocked: string[];
  remainsum?: number;
  level: number;
}

export interface ChampState {
  champid: string;
}

export interface CourseState {
  courseid?: string;
}

export interface NavigatorState {
  page: Page;
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
  action: (data: EnrichedNodeData) => void;
};

export interface Edge {
  id: string;
  target: string;
  source: string;
}
