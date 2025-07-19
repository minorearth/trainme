import { setDocInCollection, setDocInSubCollection } from "@/db/CA/firebaseCA";
import { TT } from "@/T/typesBasic";
import {
  CLT,
  CourseChapterObjDB,
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
    collectionName: CLT.chapters,
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
    (task) => task.tasktype == TT.task
  );
  await setDocInCollection({
    collectionName: CLT.newtasks,
    data: {},
    id: courseid,
  });
  await setDocInSubCollection<TaskDBWraper>({
    collectionName: CLT.newtasks,
    id: courseid,
    subCollectionName: CLT.chapters,
    subId: "alltasks",
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
    collectionName: CLT.newtasks,
    id: courseid,
    subCollectionName: CLT.chapters,
    subId: chapterid,
    data: {
      tasks: chapterTasks,
    },
  });
};

export const uploadCourseChaptersObject = async (
  chapterCourseObjectModel: CourseChapterObjDB
) => {
  await setDocInCollection<CourseChapterObjDB>({
    collectionName: CLT.views,
    data: chapterCourseObjectModel,
    id: "chaptersobject",
  });
};
