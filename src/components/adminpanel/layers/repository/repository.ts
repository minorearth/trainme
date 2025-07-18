import { CourseChapterObjReport } from "@/T/Managertypes";
import { setDocInCollection, setDocInSubCollection } from "@/db/CA/firebaseCA";
import {
  EdgeDB,
  FlowDB,
  NodeDB,
  TaskDB,
  TaskDBWraper,
  TasksLogDB,
} from "@/T/typesDB";
import { DocumentData, WithFieldValue } from "firebase/firestore";

export const uploadCourseChapters = async ({
  chapterFlowNodes,
  chapterFlowEdges,
  courseid,
}: {
  chapterFlowNodes: NodeDB[];
  chapterFlowEdges: EdgeDB[];
  courseid: string;
}) => {
  setDocInCollection<FlowDB>({
    collectionName: "chapters",
    data: { chapterFlowNodes, chapterFlowEdges },
    id: courseid,
  });
};

export const uploadAllCourseTasksView = async ({
  courseid,
  allTasksAndGuidesWithLevels,
}: {
  courseid: string;
  allTasksAndGuidesWithLevels: TaskDB[];
}) => {
  const allTasksNoGuides = allTasksAndGuidesWithLevels.filter(
    (task) => task.tasktype == "task"
  );
  await setDocInCollection({
    collectionName: "newtasks",
    data: {},
    id: courseid,
  });
  await setDocInSubCollection<TaskDBWraper>({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "alltasks",
    data: {
      tasks: allTasksNoGuides,
    },
  });
};

export const uploadChapterTasks = async ({
  courseid,
  chapterid,
  chapterTasks,
}: {
  courseid: string;
  chapterid: string;
  chapterTasks: TaskDB[];
}) => {
  setDocInSubCollection<TaskDBWraper>({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: chapterid,
    data: {
      tasks: chapterTasks,
    },
  });
};

export const uploadCourseChaptersObject = async (
  chapterCourseObjectModel: CourseChapterObjReport
) => {
  await setDocInCollection<CourseChapterObjReport>({
    collectionName: "views",
    data: chapterCourseObjectModel,
    id: "chaptersobject",
  });
};
