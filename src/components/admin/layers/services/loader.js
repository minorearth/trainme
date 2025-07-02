import { coursesToLoad } from "@/app/admin/courses";

import {
  uploadCourseChapters,
  uploadAllCourseTasks,
  uploadChapterTasks,
  uploadChapterCourseObjectModel,
} from "@/components/admin/layers/repository/repository";

import {
  prepareObjectModel,
  supplyTasksWithChapterLevel,
  getChaptersIds,
  getChapterTasks,
} from "@/components/admin/layers/services/utils";

export const load = async () => {
  let chapterCourseObjectModel = {};
  const coursesToLoad = getCoursesToLoad();

  await Promise.all(
    coursesToLoad.map(async (courseid) => {
      const { chapterFlowNodes, chapterFlowEdges, tasksall } =
        coursesToLoad[courseid];
      await uploadCourseChapters({
        chapterFlowNodes,
        chapterFlowEdges,
        courseid,
      });

      // LoadTasks
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

      chapterCourseObjectModel[courseid] = prepareObjectModel(chapterFlowNodes);
    })
  );

  await uploadChapterCourseObjectModel(chapterCourseObjectModel);
};

const getCoursesToLoad = () => {
  return Object.keys(coursesToLoad).filter(
    (courseId) => coursesToLoad[courseId].toload
  );
};
