export const allUsersMetaToObject = (completed) => {
  const res = completed.reduce(
    (acc, user) => ({
      ...acc,
      [user.userId]: getCourseChapters(user.courses),
    }),
    {}
  );
  return res;
};

const getCourseChapters = (courses) => {
  const res = Object.keys(courses).reduce(
    (acc, courseid) => ({
      ...acc,
      [courseid]: {
        completed: courses[courseid].completed,
        stat: getChaptersData(courses[courseid].stat),
      },
    }),
    {}
  );
  return res;
};

const getChaptersData = (chapters) => {
  return Object.keys(chapters).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: { sum: chapters[chapterid].sum },
    }),
    {}
  );
};
