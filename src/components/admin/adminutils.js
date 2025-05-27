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
    const { chapterFlowNodes, chapterFlowEdges, testsall } = courses[courseid];

    setDocInCollectionClient(
      "chapters",
      { chapterFlowNodes, chapterFlowEdges },
      courseid
    );

    const chapterObjectModel = prepareObjectModel(chapterFlowNodes);
    chapterCourseObjectModel[courseid] = chapterObjectModel;

    // LoadTasks
    const idLevels = getChapteeLevels(chapterFlowNodes);
    const allTasks = testsall
      .filter((task) => task.tasktype == "task")
      .map((task) => {
        return { ...task, level: idLevels[task.chapterparentid] };
      });

    // setDocInCollectionClient(taskcollection, { tasks: allTasks }, "alltasks");

    let chapters = chapterFlowNodes.map((chapter) => chapter.id);
    chapters = [...chapters, "textbook"];
    // chapters.forEach((chapterid) => {
    //   const tasks = testsall.filter((test) => test.chapterid == chapterid);
    //   tasks.length != 0 &&
    //     setDocInCollectionClient(taskcollection, { tasks }, chapterid);
    // });

    await setDocInCollectionClient("newtasks", {}, courseid);
    await setDocInSubCollectionClient(
      "newtasks",
      courseid,
      "chapters",
      "alltasks",
      {
        tasks: allTasks,
      }
    );

    chapters.forEach((chapterid) => {
      const tasks = testsall.filter((test) => test.chapterid == chapterid);
      tasks.length != 0 &&
        setDocInSubCollectionClient(
          "newtasks",
          courseid,
          "chapters",
          chapterid,
          {
            tasks,
          }
        );
    });
  });

  setDocInCollectionClient("views", chapterCourseObjectModel, "chaptersobject");
};
