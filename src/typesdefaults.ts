import { TasksetMode, TaskStage } from "./types";

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

export const TASKSET_DEFAULTS = {
  tasksetmode: "newtopic" as TasksetMode,
  recapTasksIds: [],
  taskstage: "WIP" as TaskStage,
  pts: 0,
  tasklog: [],
  randomsaved: [],
  fixed: 0,
  success: true,
};

export const USERPROGRESS_DEFAULTS = {
  completed: [],
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
