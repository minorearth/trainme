export interface RawTask {
  chapterparentid: string;
  restrictions: {
    maxlines: number;
    musthave: string[];
    musthaveRe: string[];
    forbiddenRe: string[];
    forbidden: string[];
  }[];
  inout: {
    inv: string[];
    outv: string[];
  }[];
  file: string;
  chapterid: string;
  task: string;
  taskuuid: string;
  tasktype: string;
  defaultcode: string;
  rightcode: string;
  forbiddencode: string;
  defaultoutput: string[];
  defaultinput: string;
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
  tasktype: string;
  tasktext: string;
  code: string;
  input: string;
  filedata: string;
  output: string;
  expectedOutput: string;
  maxlines: number;
  restrictErrors: string;
};

export enum TaskStage {
  recap,
  recap_suspended,
}

export type Nodemode = "champ" | "textbook" | "exam" | "addhoc" | "newtopic";

export interface UserProgress {
  completed: any;
  rating: any;
  unlocked: any;
  stat: any;
}
