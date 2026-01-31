import { TS, PS, PG, NM, TSM, ST, CS, CT, TT, STT, GetDF, SetDF } from "../const/const";
export type TasksetStage = (typeof TS)[keyof typeof TS];
export type Persstatus = (typeof PS)[keyof typeof PS];
export type Page = (typeof PG)[keyof typeof PG];
export type NodeModes = (typeof NM)[keyof typeof NM];
export type TasksetModeSpecific = (typeof TSM)["champ" | "textbook" | "exam" | "default"];
export type TasksetMode = TasksetModeSpecific | Extract<NodeModes, "newtopic" | "addhoc" | "exam">;
export type SuccessType = (typeof ST)[keyof typeof ST];
export type Champstatus = (typeof CS)[keyof typeof CS];
export type CourseType = (typeof CT)[keyof typeof CT];
export type UnitType = (typeof TT)[keyof typeof TT];
export type StateType = (typeof STT)[keyof typeof STT];
export type GetDataFetchTypes = (typeof GetDF)[keyof typeof GetDF];
export type SetDataFetch = (typeof SetDF)[keyof typeof SetDF];
//# sourceMappingURL=typesBasic.d.ts.map