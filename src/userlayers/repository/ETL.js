export const ETLUserProgress = (data) => {
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

export const getInitalDataForFreeCourses = (freeCourses, courses) => {
  return freeCourses.reduce(
    (acc, item, id) => ({
      ...acc,
      [item]: {
        lastunlocked: [courses[freeCourses[id]].firstchapter],
        unlocked: [courses[freeCourses[id]].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {}
  );
};
