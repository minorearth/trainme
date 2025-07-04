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

export const uploadAllCourseTasks = async ({
  courseid,
  allTasksWithLevels,
}) => {
  await setDocInCollectionClient("newtasks", {}, courseid);
  await setDocInSubCollectionClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks",
    {
      tasks: allTasksWithLevels,
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
