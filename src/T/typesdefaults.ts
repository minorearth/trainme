import { completedChapters, NodeModes } from "./typesDB";
import { Page, SuccessType, TasksetMode, TasksetStage } from "./typesState";

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
  tasktype: "",
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
  page: "courses" as Page,
};

export const TASKSET_DEFAULTS = {
  tasksetmode: "default" as TasksetMode,
  recapTasksIds: [],
  taskstage: "WIP" as TasksetStage,
  pts: 0,
  tasklog: {},
  randomsaved: [],
  fixed: 0,
  success: "undefined" as SuccessType,
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
//   champ: { page: "lessonStarted" },
//   addhoc: { page: "lessonStarted" },
//   exam: { page: "lessonStarted" },
//   newtopic: { page: "lessonStarted" },
//   textbook: { page: "lessonStarted" },
// };
