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
import {
  ChapterObjReport,
  CourseChapterObjReport,
} from "@/components/manager/types";
import { CoursesToLoad, Node, Task } from "@/types";
import { Edge } from "@xyflow/react";

export const load = async (coursesToLoad: CoursesToLoad) => {
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
  coursesToLoad: CoursesToLoad;
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
  coursesToLoad: CoursesToLoad;
}) => {
  let chapterCourseObjectModel: CourseChapterObjReport = {};
  coursesToLoadIds.forEach(
    (courseid) =>
      (chapterCourseObjectModel[courseid] =
        coursesToLoad[courseid].chapterFlowNodesObj)
  );

  await uploadCourseChaptersObject(chapterCourseObjectModel);
};
