import {
  chapterFlowNodes,
  chapterFlowEdges,
} from "@/components/admin/chaptersFlowData";
import { testsall } from "@/components/admin/output";
import { setDocInCollectionClient } from "@/db/domain/domain";

export const load = () => {
  console.log("sasdasdasd", chapterFlowNodes);
  setDocInCollectionClient(
    "chapters",
    { chapterFlowNodes, chapterFlowEdges },
    "lpN57HSZBLZCnP2j9l9L"
  );

  const chapters = chapterFlowNodes.map((chapter) => chapter.id);
  chapters.forEach((chapterid) => {
    const tasks = testsall.filter((test) => test.chapterid == chapterid);
    tasks.length != 0 &&
      setDocInCollectionClient("tasks", { tasks }, chapterid);
  });
};
