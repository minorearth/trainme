import {
  uploadCourseChapters,
  uploadAllCourseTasks,
  uploadChapterTasks,
  uploadCourseChaptersObject,
} from "@/components/adminpanel/layers/repository/repository";

import {
  supplyTasksWithChapterLevel,
  getChaptersIds,
  getChapterTasks,
} from "@/components/adminpanel/layers/services/utils";

export const load = async (coursesToLoad) => {
  const coursesToLoadIds = Object.keys(coursesToLoad);
  await Promise.all(
    coursesToLoadIds.map(
      async (courseid) => await uploadCourse({ courseid, coursesToLoad })
    )
  );
  await prepareAndUploadCourseChaptersObj({ coursesToLoadIds, coursesToLoad });
};

const uploadCourse = async ({ courseid, coursesToLoad }) => {
  const { chapterFlowNodes, chapterFlowEdges, tasksall } =
    coursesToLoad[courseid];

  await uploadCourseChapters({
    chapterFlowNodes,
    chapterFlowEdges,
    courseid,
  });

  const allTasksWithLevels = supplyTasksWithChapterLevel({
    tasksall,
    chapterFlowNodes,
  });

  await uploadAllCourseTasks({ courseid, allTasksWithLevels });

  const chaptersIds = getChaptersIds(chapterFlowNodes);
  await Promise.all(
    chaptersIds.map(async (chapterid) => {
      const chapterTasks = getChapterTasks({ chapterid, tasksall });
      chapterTasks.length != 0 &&
        (await uploadChapterTasks({ courseid, chapterid, chapterTasks }));
    })
  );
};

const prepareAndUploadCourseChaptersObj = async ({
  coursesToLoadIds,
  coursesToLoad,
}) => {
  let chapterCourseObjectModel = {};
  coursesToLoadIds.forEach(
    (courseid) =>
      (chapterCourseObjectModel[courseid] =
        coursesToLoad[courseid].chapterFlowNodesObj)
  );

  await uploadCourseChaptersObject(chapterCourseObjectModel);
};
