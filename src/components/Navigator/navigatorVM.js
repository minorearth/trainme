import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";
import { getTargetsBySource } from "./utils";

const fullFillProgess = (
  unlocked,
  completed,
  chapterFlowNodes,
  edges,
  setTestsStartedPage
) => {
  const full = chapterFlowNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      unlocked: unlocked.includes(node.id),
      completed: completed.includes(node.id),
      action: (id) => {
        // const nextchapters = getTargetsBySource(id, edges);
        setTestsStartedPage(id);
      },
    },
  }));
  return full;
};

export const setFlowNodes = async ({
  progress,
  setFlow,
  setTestsStartedPage,
}) => {
  // progress.current = await getProgress(userid);
  // progress.current = userProgress;
  getDocDataFromCollectionByIdClient("chapters", "lpN57HSZBLZCnP2j9l9L").then(
    (data) => {
      const edges = data.data.chapterFlowEdges;
      console.log("edeges", edges);
      setFlow({
        edges,
        nodes: fullFillProgess(
          progress.unlocked,
          progress.completed,
          data.data.chapterFlowNodes,
          edges,
          setTestsStartedPage
        ),
      });
    }
  );
};

export const getTests = async (chapter) => {
  //local, do not remove
  // const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
  const filteredTasks = await getDocDataFromCollectionByIdClient(
    "tasks",
    chapter
  );
  return filteredTasks.data.tasks;
};

export const getTestsRecap = (chapter, recapTasks, tasks) => {
  const filteredTasks = tasks
    .filter((test) => test.chapterid == chapter)
    .filter((test, id) => recapTasks.includes(id));
  return filteredTasks;
};
