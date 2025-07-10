import {
  setDocInCollectionClient,
  setDocInSubCollectionClient,
} from "@/db/CA/interface";

export const uploadCourseChapters = async ({
  chapterFlowNodes,
  chapterFlowEdges,
  courseid,
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
}) => {
  setDocInSubCollectionClient("newtasks", courseid, "chapters", chapterid, {
    tasks: chapterTasks,
  });
};

export const uploadCourseChaptersObject = async (chapterCourseObjectModel) => {
  await setDocInCollectionClient(
    "views",
    chapterCourseObjectModel,
    "chaptersobject"
  );
};
