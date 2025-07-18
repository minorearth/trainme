import { ChapterObjReportDB, NodeDB } from "@/T/typesDB";

export const chaptersObjToArraySorted = (chapters: ChapterObjReportDB) => {
  const res = Object.keys(chapters).map((chapterId) => ({
    id: chapterId,
    order: chapters[chapterId].order,
    maxcoins: chapters[chapterId].maxcoins,
  }));
  return res.sort((a, b) => a.order - b.order);
};

export const extractChapterIdsOnly_admin = (chapterFlowNodes: NodeDB[]) => {
  return chapterFlowNodes.map((node) => node.id).filter((id) => id[0] != "-");
};
