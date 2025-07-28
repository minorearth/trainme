import { ChapterObjReportDB } from "tpconst/T";

export const chaptersObjToArraySorted = (chapters: ChapterObjReportDB) => {
  const res = Object.keys(chapters).map((chapterId) => ({
    id: chapterId,
    order: chapters[chapterId].order,
    maxcoins: chapters[chapterId].maxcoins,
  }));
  return res.sort((a, b) => a.order - b.order);
};
