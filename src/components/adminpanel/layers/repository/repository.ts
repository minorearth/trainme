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
  setDocInCollectionClient(
    "chapters",
    { chapterFlowNodes, chapterFlowEdges },
    courseid
  );
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
  await setDocInCollectionClient("newtasks", {}, courseid);
  await setDocInSubCollectionClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks",
    {
      tasks: allTasksNoGuides,
    }
  );
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
  setDocInSubCollectionClient("newtasks", courseid, "chapters", chapterid, {
    tasks: chapterTasks,
  });
};

export const uploadCourseChaptersObject = async (
  chapterCourseObjectModel: CourseChapterObjReport
) => {
  await setDocInCollectionClient(
    "views",
    chapterCourseObjectModel,
    "chaptersobject"
  );
};
