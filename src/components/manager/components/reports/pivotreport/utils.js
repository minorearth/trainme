export const getGroupUsersObj = (groupsdata, itemId) => {
  const group = groupsdata.filter((item) => item.id == itemId)[0];
  const users = group.children.reduce(
    (acc, item) => ({
      ...acc,
      [item.uid]: { name: item.label, uid: item.uid },
    }),
    {}
  );
  return users;
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

export const userMetaToObject = (completed) => {
  const res = completed.reduce(
    (acc, user) => ({
      ...acc,
      [user.userId]: getCourseChapters(user.courses),
    }),
    {}
  );
  return res;
};

export const chaptersObjToArray = (chapters) => {
  const res = Object.keys(chapters).map((chapterId) => ({
    chapterId,
    order: chapters[chapterId].order,
    maxcoins: chapters[chapterId].maxcoins,
  }));
  return res.sort((a, b) => a.order - b.order);
};
