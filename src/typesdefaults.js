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

export const CHAPTER_DEFAULTS = { chapterid: "", level: -1, tobeunlocked: [] };

export const USERPROGRESS_DEFAULTS = {
  completed: [],
  rating: -1,
  unlocked: [],
  stat: {},
  paid: [],
};
