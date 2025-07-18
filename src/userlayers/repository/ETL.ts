import { CourseProgressDB } from "@/T/typesDB";

export const ETLUserProgress = (data: CourseProgressDB) => {
  const stat = Object.keys(data.stat).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: {
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
