import {
  setDocInCollectionClient,
  setDocInSubCollectionClient,
} from "@/db/domain/domain";

import { getCoursesToLoad, courses } from "@/globals/courses";

const getChapteeLevels = (chapters) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};

const prepareObjectModel = (chapterFlowNodes) => {
  return chapterFlowNodes
    .filter((item) => item.data.lottie == "no")
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: {
          title: item.data.title,
          maxcoins: item.data.maxcoins,
          nodemode: item.data.nodemode,
          order: item.data.order,
        },
      }),
      {}
    );
};

export const load = () => {
  let chapterCourseObjectModel = {};
  const coursesToLoad = getCoursesToLoad();
  coursesToLoad.forEach(async (courseid) => {
    const { chapterFlowNodes, chapterFlowEdges, tasksall } = courses[courseid];

    setDocInCollectionClient(
      "chapters",
      { chapterFlowNodes, chapterFlowEdges },
      courseid
    );

    const chapterObjectModel = prepareObjectModel(chapterFlowNodes);
    chapterCourseObjectModel[courseid] = chapterObjectModel;

    // LoadTasks
    const idLevels = getChapteeLevels(chapterFlowNodes);
    const allTasksWithLevels = tasksall
      .filter((task) => task.tasktype == "task")
      .map((task) => {
        return { ...task, level: idLevels[task.chapterparentid] };
      });

    let chapters = chapterFlowNodes.map((chapter) => chapter.id);
    chapters = [...chapters, "textbook"];

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

    chapters.forEach((chapterid) => {
      const chapterTasks = tasksall.filter(
        (test) => test.chapterid == chapterid
      );
      chapterTasks.length != 0 &&
        setDocInSubCollectionClient(
          "newtasks",
          courseid,
          "chapters",
          chapterid,
          {
            tasks: chapterTasks,
          }
        );
    });
  });

  setDocInCollectionClient("views", chapterCourseObjectModel, "chaptersobject");
};
