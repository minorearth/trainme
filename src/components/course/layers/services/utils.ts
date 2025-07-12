import { ChapterState, Node, NodeData } from "@/types";
import { ChapterObjReport } from "@/components/manager/types";

export const chaptersObjToArraySorted = (chapters: ChapterObjReport) => {
  const res = Object.keys(chapters).map((chapterId) => ({
    id: chapterId,
    order: chapters[chapterId].order,
    maxcoins: chapters[chapterId].maxcoins,
  }));
  return res.sort((a, b) => a.order - b.order);
};

export const extractChapterIdsOnly_admin = (chapterFlowNodes: Node[]) => {
  return chapterFlowNodes.map((node) => node.id).filter((id) => id[0] != "-");
};
