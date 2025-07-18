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
import { ChapterObjReport, CourseChapterObjReport } from "@/T/Managertypes";
import { CoursesDataToUpload } from "@/T/typesUpload";
import { Edge } from "@xyflow/react";
import splash from "@/components/common/splash/store";
import { coursesToLoad } from "@/components/adminpanel/layers/services/courses";
import { TaskDB } from "@/T/typesDB";

export const uploadCourses = async () => {
  splash.setShowProgress(true);
  //confirm as
  await load(coursesToLoad as CoursesDataToUpload);
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
      if (chapterid == "textbook")
        console.log("textbook", chapterTasksWithLevels);

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
  let chapterCourseObjectModel: CourseChapterObjReport = {};
  coursesToLoadIds.forEach(
    (courseid) =>
      (chapterCourseObjectModel[courseid] =
        coursesToLoad[courseid].chapterFlowNodesObj)
  );

  await uploadCourseChaptersObject(chapterCourseObjectModel);
};
