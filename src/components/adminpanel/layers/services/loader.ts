//repository

import {
  uploadCourseChapters,
  uploadAllCourseTasksView,
  uploadChapterTasks,
  uploadCourseChaptersObject,
} from "@/components/adminpanel/layers/repository/repository";

//services(local)
import {
  supplyTasksWithChapterLevel,
  getChaptersIdsAndTextBookId,
  getChapterTasks,
} from "@/components/adminpanel/layers/services/loaderHelpers";
import { CoursesDataToUpload } from "@/T/typesUpload";
import { Edge } from "@xyflow/react";
import splash from "@/components/common/splash/store";
import { CourseChapterObjDB, TaskDB } from "@/T/typesDB";

import S from "@/globals/settings";

export const uploadCourses = async (coursesToLoad: CoursesDataToUpload) => {
  splash.showProgress(true);
  //confirm as
  await load(coursesToLoad);
  splash.closeProgress();
};

const load = async (coursesToLoad: CoursesDataToUpload) => {
  const coursesToLoadIds = Object.keys(coursesToLoad);
  await Promise.all(
    coursesToLoadIds.map(
      async (courseid) => await uploadCourse({ courseid, coursesToLoad })
    )
  );
  await prepareAndUploadCourseChaptersObj({ coursesToLoadIds, coursesToLoad });
};

const uploadCourse = async ({
  courseid,
  coursesToLoad,
}: {
  courseid: string;
  coursesToLoad: CoursesDataToUpload;
}) => {
  const { chapterFlowNodes, chapterFlowEdges, tasksall } =
    coursesToLoad[courseid];

  await uploadCourseChapters({
    chapterFlowNodes,
    chapterFlowEdges,
    courseid,
  });

  const allTasksAndGuidesWithLevels = supplyTasksWithChapterLevel({
    tasks: tasksall,
    chapterFlowNodes,
  });

  await uploadAllCourseTasksView({ courseid, allTasksAndGuidesWithLevels });

  const chaptersIds = getChaptersIdsAndTextBookId(chapterFlowNodes);

  await Promise.all(
    chaptersIds.map(async (chapterid) => {
      const chapterTasks = getChapterTasks({ chapterid, tasksall });

      const chapterTasksWithLevels = supplyTasksWithChapterLevel({
        tasks: chapterTasks,
        chapterFlowNodes,
      });
      if (chapterid == S.db.TEXT_BOOK_TASKS_ID)
        chapterTasksWithLevels.length != 0 &&
          (await uploadChapterTasks({
            courseid,
            chapterid,
            chapterTasks: chapterTasksWithLevels,
          }));
    })
  );
};

const prepareAndUploadCourseChaptersObj = async ({
  coursesToLoadIds,
  coursesToLoad,
}: {
  coursesToLoadIds: string[];
  coursesToLoad: CoursesDataToUpload;
}) => {
  let chapterCourseObjectModel: CourseChapterObjDB = {};
  coursesToLoadIds.forEach(
    (courseid) =>
      (chapterCourseObjectModel[courseid] =
        coursesToLoad[courseid].chapterFlowNodesObj)
  );

  await uploadCourseChaptersObject(chapterCourseObjectModel);
};
