import { CourseProgressDB, CourseStatDB } from "../../../T";

export const ETLUserProgress = (data: CourseProgressDB) => {
  const stat: CourseStatDB = Object.keys(data.stat).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: {
        //TODO:(later)Tasks att missng is not detected by  typescript !?
        sum: data.stat[chapterid].sum,
      },
    }),
    {}
  );
  return {
    ...data,
    stat,
  };
};
