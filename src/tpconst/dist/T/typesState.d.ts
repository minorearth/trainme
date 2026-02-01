import { Page, SuccessType, UnitsetMode, UnitsetStage } from "./typesBasic";
import { ChapterProgressDB, CourseProgressDB, CoursesDB, EdgeDB, GuideDB, NodeDataDB, NodeDB, TaskDB, TasksLogDB } from "./typesDB";
import { InOutDB } from "./typesUpload";
export interface TaskDBWithFiles extends TaskDB {
    inout: InOutWithFilesDataState[];
    filedata: string;
}
export interface GuideDBWithFiles extends GuideDB {
    inout: InOutWithFilesDataState[];
    filedata: string;
}
export interface InOutWithFilesDataState extends InOutDB {
    filesdata: string[];
}
export interface Task extends TaskDBWithFiles {
    tasktext: string;
}
export interface Guide extends GuideDBWithFiles {
}
export type Unit = Task | Guide;
export interface FlowState {
    nodes: NodeDBState[];
    edges: EdgeDB[];
}
export interface NodeDBState extends NodeDB {
    data: NodeDataState;
}
export interface NodeDataState extends NodeDataDB {
    sum: ChapterProgressDB["sum"];
    completed: boolean;
    unlocked: boolean;
    paid: boolean;
    tobeunlocked: string[];
    overflow: boolean;
    remainsum: number;
    action: (data: NodeDataState) => void;
}
export interface UnitsetStatePersisted {
    unitsetmode: UnitsetMode;
    recapTasksIds: number[];
    unitsetstage: UnitsetStage;
    pts: number;
    tasklog: TasksLogDB;
    randomsaved: string[];
    fixed: number;
    success: SuccessType;
    currUnitId: number;
}
export interface UserStatePersisted {
    username: string;
    progress: CourseProgressDB;
}
export type ChapterStatePersisted = Pick<NodeDataState, "completed" | "overflow" | "tobeunlocked" | "level" | "remainsum"> & {
    chapterid: NodeDataState["id"];
};
export interface ChampStatePersisted {
    champid: string;
}
export type CourseStatePersisted = Pick<CoursesDB, "courseid">;
export interface NavigatorStatePersisted {
    page: Page;
}
//# sourceMappingURL=typesState.d.ts.map