import { CourseChapterObjReport } from "@/components/manager/types";
import {
  setDocInCollectionClient,
  setDocInSubCollectionClient,
} from "@/db/CA/interface";
import { Edge, Node, RawTask } from "@/types";

export const uploadCourseChapters = async ({
  chapterFlowNodes,
  chapterFlowEdges,
  courseid,
}: {
  chapterFlowNodes: Node[];
  chapterFlowEdges: Edge[];
  courseid: string;
}) => {
  setDocInCollectionClient({
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
  allTasksAndGuidesWithLevels: RawTask[];
}) => {
  const allTasksNoGuides = allTasksAndGuidesWithLevels.filter(
    (task) => task.tasktype == "task"
  );
  await setDocInCollectionClient({
    collectionName: "newtasks",
    data: {},
    id: courseid,
  });
  await setDocInSubCollectionClient({
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
  chapterTasks: RawTask[];
}) => {
  setDocInSubCollectionClient({
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
  await setDocInCollectionClient({
    collectionName: "views",
    data: chapterCourseObjectModel,
    id: "chaptersobject",
  });
};
