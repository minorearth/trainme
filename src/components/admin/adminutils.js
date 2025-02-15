import {
  chapterFlowNodes,
  chapterFlowEdges,
} from "@/components/admin/chaptersFlowData";
import { testsall } from "@/components/admin/output";
import { setDocInCollectionClient } from "@/db/domain/domain";

export const load = () => {
  setDocInCollectionClient(
    "chapters",
    { chapterFlowNodes, chapterFlowEdges },
    "lpN57HSZBLZCnP2j9l9L"
  );

  let chapters = chapterFlowNodes.map((chapter) => chapter.id);
  chapters = [...chapters, "2e31a4ae-242d-4c55-b801-ef12ccc06013"];
  chapters.forEach((chapterid) => {
    const tasks = testsall.filter((test) => test.chapterid == chapterid);
    tasks.length != 0 &&
      setDocInCollectionClient("tasks", { tasks }, chapterid);
  });
};
