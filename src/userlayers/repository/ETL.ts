import { CourseProgress } from "@/types";

export const ETLUserProgress = (data: CourseProgress) => {
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
