export const TS = {
  recap: "recaps",
  recapSuspended: "recap_suspended",
  WIP: "WIP",
  accomplishedSuspended: "accomplished_suspended",
} as const;

export const PS = {
  champwip: "champwip",
  champisover: "champisover",
  joined: "joined",
  undefined: "undefined",
} as const;

export const PG = {
  testrun: "testrun",
  flow: "flow",
  courses: "courses",
  pg: "pg",

  champ: "champ",
  lessonStarted: "lessonStarted",
  congrat: "congrat",
} as const;

//refreesh all types in excel after editing

const newtopic = "newtopic";
const addhoc = "addhoc";
const exam = "exam";

export const NM = {
  newtopic,
  addhoc,
  exam,
  animation: "animation",
} as const;

export const TSM = {
  newtopic,
  addhoc,
  exam,
  champ: "champ",
  textbook: "textbook",
  default: "default",
} as const;

export const TT = { guide: "guide", task: "task" } as const;

export const CS = { started: "started", created: "created" } as const;

export const ST = {
  success: "success",
  fail: "fail",
  undefined: "undefined",
} as const;

export const CT = { course: "course", champ: "champ" } as const;
export const STT = {
  navigator: "navigator",
  course: "course",
  champ: "champ",
  chapter: "chapter",
  unitset: "unitset",
  user: "user",
} as const;

export const GetDF = {
  getusermetadata: "getusermetadata",
  getuserCoursemetadata: "getuserCoursemetadata",
  checkcoursepaid: "checkcoursepaid",
  getpaymentid: "getpaymentid",
} as const;

export const SetDF = {
  paychapter: "paychapter",
  setProgress: "setprogress",
  setProgressDBFull: "setProgressDBFull",
} as const;

export const CLT = {
  champ: "champ",
  chapters: "chapters",
  groups: "groups",
  units: "units",
  usermeta: "usermeta",
  views: "views",
  snapshots: "snapshots",
  snapshot: "snapshot",
} as const;

export const URT = {
  nottask: "nottask",
  task: "task",
} as const;
