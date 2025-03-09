import {
  chapterFlowNodes1,
  chapterFlowEdges1,
  chapterFlowNodes2,
  chapterFlowEdges2,
} from "@/components/admin/chaptersFlowData";
import { testsall1 } from "@/components/admin/course1";
import { testsall2 } from "@/components/admin/course2";
import { setDocInCollectionClient } from "@/db/domain/domain";
import { courses } from "@/globals/courses";

const getChapteeLevels = (chapters) => {
  return chapters.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.data.level }),
    {}
  );
};

export const load = () => {
  const a = [chapterFlowNodes1, chapterFlowNodes2];
  const b = [chapterFlowEdges1, chapterFlowEdges2];
  const v = [
    "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
    "a3905595-437e-47f3-b749-28ea5362bd39",
  ];
  const d = [testsall1, testsall2];
  const m = [0, 1];

  m.forEach((id) => {
    setDocInCollectionClient(
      "chapters",
      { chapterFlowNodes: a[id], chapterFlowEdges: b[id] },
      courses[v[id]].chaptersdoc
    );

    // LoadTasks
    const idLevels = getChapteeLevels(a[id]);
    const allTasks = d[id]
      .filter((task) => task.tasktype == "task")
      .map((task) => {
        return { ...task, level: idLevels[task.chapterparentid] };
      });

    setDocInCollectionClient(
      courses[v[id]].taskcollection,
      { tasks: allTasks },
      "alltasks"
    );

    let chapters = a[id].map((chapter) => chapter.id);
    chapters = [...chapters, courses[v[id]].textbookchapter];
    chapters.forEach((chapterid) => {
      const tasks = d[id].filter((test) => test.chapterid == chapterid);
      console.log("zu", tasks);
      tasks.length != 0 &&
        setDocInCollectionClient(
          courses[v[id]].taskcollection,
          { tasks },
          chapterid
        );
    });
  });
};
