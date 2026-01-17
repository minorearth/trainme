import { Page, SuccessType, TasksetMode, TasksetStage } from "./typesBasic";
import { ChapterProgressDB, CourseProgressDB, CoursesDB, EdgeDB, NodeDataDB, NodeDB, TaskDB, TasksLogDB } from "./typesDB";
import { InOutDB } from "./typesUpload";
export interface TaskDBWithFiles extends TaskDB {
    inout: InOutWithFilesDataState[];
    filedata: string;
}
export interface InOutWithFilesDataState extends InOutDB {
    filesdata: string[];
}
export interface Task extends TaskDBWithFiles {
    tasktext: string;
}
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
export interface TasksetStatePersisted {
    tasksetmode: TasksetMode;
    recapTasksIds: number[];
    taskstage: TasksetStage;
    pts: number;
    tasklog: TasksLogDB;
    randomsaved: string[];
    fixed: number;
    success: SuccessType;
    currTaskId: number;
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