export const chaptersObjToArraySorted = (chapters) => {
  const res = Object.keys(chapters).map((chapterId) => ({
    chapterId,
    order: chapters[chapterId].order,
    maxcoins: chapters[chapterId].maxcoins,
  }));
  return res.sort((a, b) => a.order - b.order);
};

export const extractChapterIdsOnly_admin = (nodes) => {
  return nodes.map((node) => node.id).filter((id) => id[0] != "-");
};
