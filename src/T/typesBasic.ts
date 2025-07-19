export const TS = {
  recap: "recaps",
  recapSuspended: "recap_suspended",
  WIP: "WIP",
  accomplishedSuspended: "accomplished_suspended",
} as const;

export type TasksetStage = (typeof TS)[keyof typeof TS];

export const PS = {
  champwip: "champwip",
  champisover: "champisover",
  joined: "joined",
  undefined: "undefined",
} as const;

export type Persstatus = (typeof PS)[keyof typeof PS];

export const PG = {
  testrun: "testrun",
  flow: "flow",
  courses: "courses",
  champ: "champ",
  lessonStarted: "lessonStarted",
  congrat: "congrat",
} as const;

export type Page = (typeof PG)[keyof typeof PG];

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

export type NodeModes = (typeof NM)[keyof typeof NM];

export type TasksetModeSpecific = (typeof TSM)[
  | "champ"
  | "textbook"
  | "exam"
  | "default"];

export type TasksetMode =
  | TasksetModeSpecific
  | Extract<NodeModes, "newtopic" | "addhoc" | "exam">;

export const ST = {
  success: "success",
  fail: "fail",
  undefined: "undefined",
} as const;

export type SuccessType = (typeof ST)[keyof typeof ST];

export const CS = { started: "started", created: "created" } as const;

export type Champstatus = (typeof CS)[keyof typeof CS];

export const CT = { course: "course", champ: "champ" } as const;

export type CourseType = (typeof CT)[keyof typeof CT];

export const TT = { guide: "guide", task: "task" } as const;
export type TaskType = (typeof TT)[keyof typeof TT];
