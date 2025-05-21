import { setDocInCollectionClient } from "@/db/domain/domain";

import { getCoursesToLoad, courses } from "@/globals/courses";

const getChapteeLevels = (chapters) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};

// {
//   id: "4680f00b-b586-413c-890a-9669b4b7b1c3",
//   position: { x: 550, y: 0 },
//   type: "turbo",
//   data: {
//     id: "4680f00b-b586-413c-890a-9669b4b7b1c3",
//     type: "turbo",
//     title: "Вывод данных",
//     lottie: "no",
//     subline: "Учимся печатать данные",
//     unlockpts: null,
//     maxcoins: 30,
//     level: 1,
//     nodemode: "newtopic",
//   },
// },

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
  coursesToLoad.forEach((id) => {
    const {
      chapterFlowNodes,
      chapterFlowEdges,
      chaptersdoc,
      testsall,
      textbookchapter,
      taskcollection,
    } = courses[id];

    setDocInCollectionClient(
      "chapters",
      { chapterFlowNodes, chapterFlowEdges },
      chaptersdoc
    );

    const chapterObjectModel = prepareObjectModel(chapterFlowNodes);
    chapterCourseObjectModel[id] = chapterObjectModel;

    // LoadTasks
    const idLevels = getChapteeLevels(chapterFlowNodes);
    const allTasks = testsall
      .filter((task) => task.tasktype == "task")
      .map((task) => {
        return { ...task, level: idLevels[task.chapterparentid] };
      });

    setDocInCollectionClient(taskcollection, { tasks: allTasks }, "alltasks");

    let chapters = chapterFlowNodes.map((chapter) => chapter.id);
    chapters = [...chapters, textbookchapter];
    chapters.forEach((chapterid) => {
      const tasks = testsall.filter((test) => test.chapterid == chapterid);
      tasks.length != 0 &&
        setDocInCollectionClient(taskcollection, { tasks }, chapterid);
    });
  });

  setDocInCollectionClient("views", chapterCourseObjectModel, "chaptersobject");
};
