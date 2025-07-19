import {
  Page,
  PG,
  ST,
  SuccessType,
  TasksetMode,
  TS,
  TSM,
  TT,
} from "./typesBasic";
import { completedChapters } from "./typesDB";

export const TASK_DEFAULTS = {
  id: -1,
  defaultcode: "",
  taskuuid: "",
  inout: [
    {
      outv: [""],
      inv: [""],
      filesdata: [""],
    },
  ],
  tasktype: TT.task,
  level: -1,
  restrictions: {
    musthave: [""],
    maxlines: 1,
    musthaveRe: [""],
    forbidden: [""],
    forbiddenRe: [""],
  },
  task: "loading",
  forbiddencode: "",
  defaultoutput: [""],
  defaultinput: [""],
  rightcode: "",
  chapterparentid: "",
  chapterid: "",
  tasktext: "",
  filedata: "",
};

export const CHAPTER_DEFAULTS = {
  chapterid: "",
  level: -1,
  tobeunlocked: [],
  remainsum: -1,
  completed: false,
  overflow: false,
};

export const CHAMP_DEFAULTS = {
  champid: "",
};

export const COURSE_DEFAULTS = {
  courseid: "",
};

export const NAVIGATOR_DEFAULTS = {
  page: PG.courses,
};

export const TASKSET_DEFAULTS = {
  tasksetmode: TSM.default,
  recapTasksIds: [],
  taskstage: TS.WIP,
  pts: 0,
  tasklog: {},
  randomsaved: [],
  fixed: 0,
  success: ST.undefined,
  currTaskId: -1,
};

export const USERPROGRESS_DEFAULTS = {
  completed: [] as completedChapters,
  rating: -1,
  unlocked: [],
  stat: {},
  paid: [],
  lastunlocked: [],
};

export const CHAMPUSER_DEFAULTS = {
  name: "",
  pts: 0,
  change: 0,
  avatarid: -1,
};

export const CSP_DEFAULTS = {
  navigator: NAVIGATOR_DEFAULTS,
  course: COURSE_DEFAULTS,
  champ: CHAMP_DEFAULTS,
  chapter: CHAPTER_DEFAULTS,
  taskset: TASKSET_DEFAULTS,
  user: { username: "", progress: USERPROGRESS_DEFAULTS },
};

// export const nodeModePages: { [K in TasksetMode]: { page: string } } = {
//   champ: { page: PG.lessonStarted },
//   addhoc: { page: PG.lessonStarted },
//   exam: { page: PG.lessonStarted },
//   newtopic: { page: PG.lessonStarted },
//   textbook: { page: PG.lessonStarted },
// };
