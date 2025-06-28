import { chaptersObjToArray } from "@/components/manager/groupsNreports/reports/pivotreport/layers/services/utils";

export const prepareReport = ({
  allCoursesChapters,
  usersMetaObj,
  usernames,
  snapShot,
}) => {
  const report = makeReport({
    allCoursesChapters,
    usersMetaObj,
    usernames,
    snapShot,
  });

  return report;
};

const makeReport = ({
  allCoursesChapters,
  usersMetaObj,
  usernames,
  snapShot,
}) => {
  let report = {};
  console.log("usersMetaObj", usersMetaObj);

  Object.keys(allCoursesChapters).forEach((courseid) => {
    const rows = Object.keys(usernames).map((user, id) =>
      getRows({
        chapters: allCoursesChapters[courseid],
        user: usernames[user],
        order: id,
        usersMetaObj,
        courseid,
        snapShot,
      })
    );
    report[courseid] = { rows };
  });

  Object.keys(allCoursesChapters).map((courseid) => {
    let cols = getColumns(allCoursesChapters[courseid]);
    cols = [{ header: "Имя", accessor: "col0" }, ...cols];
    report[courseid] = { ...report[courseid], cols };
  });

  return report;
};

const getCellValue = (chapters, chapter) => {
  if (chapters.stat[chapter.chapterId]) {
    return chapters.stat[chapter.chapterId].sum;
  } else {
    return "";
  }
};

const getCompletedInfo = (usersMetaObj, snapShot, chapterId) => {
  const isInclude = usersMetaObj.includes(chapterId);
  const isIncludeSnapShot = snapShot.includes(chapterId);
  if (isInclude && isIncludeSnapShot) return "#1878D4";
  if (isInclude && !isIncludeSnapShot) return "#CADCEE";
  if (!isInclude && !isIncludeSnapShot) return "white";
};

const getRows = ({
  chapters,
  user,
  order,
  usersMetaObj,
  courseid,
  snapShot,
}) => {
  const chaptersArr = chaptersObjToArray(chapters);

  const rows = chaptersArr.reduce(
    (acc, chapter, id) => ({
      ...acc,
      [`col${id + 1}`]: {
        completed: getCompletedInfo(
          usersMetaObj[user.uid][courseid].completed,
          snapShot[user.uid] ? snapShot[user.uid][courseid].completed : [],
          chapter.chapterId
        ),
        sum: getCellValue(usersMetaObj[user.uid][courseid], chapter),
        maxcoins: chapter.maxcoins,
      },
      id: order,
    }),
    {}
  );
  return { ...rows, col0: { sum: user.name } };
};

const getColumns = (chapters) => {
  return Object.keys(chapters)
    .map((chapterid) => ({
      header: `${chapters[chapterid].order}`,
      accessor: `col${chapters[chapterid].order}`,
      order: chapters[chapterid].order,
      maxcoins: chapters[chapterid].maxcoins,
      title: chapters[chapterid].title,
    }))
    .sort((a, b) => a.order - b.order);
};
