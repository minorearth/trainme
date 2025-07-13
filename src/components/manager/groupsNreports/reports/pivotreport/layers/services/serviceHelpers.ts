import { chaptersObjToArraySorted } from "@/components/course/layers/services/utils";
import {
  UserCoursesReportAttrs,
  UsersMetaReport,
  ChapterObjReport,
  ChapterArrReport,
  PivotReport,
} from "@/components/manager/types";

import {
  GroupUserObjReport,
  GroupUserObjReportAttr,
} from "@/components/manager/types";

import { CourseChapterObjReport } from "@/components/manager/types";

export const makeReport = ({
  allCoursesChaptersObj,
  usersMetaObj,
  groupUsersObj,
  snapShot,
}: {
  allCoursesChaptersObj: CourseChapterObjReport;
  usersMetaObj: UsersMetaReport;
  groupUsersObj: GroupUserObjReport;
  snapShot: UsersMetaReport;
}) => {
  let report: PivotReport = {};

  Object.keys(allCoursesChaptersObj).forEach((courseid) => {
    const rows = Object.keys(groupUsersObj).map((user, id) =>
      getRows({
        chapters: allCoursesChaptersObj[courseid],
        user: groupUsersObj[user],
        order: id,
        usersMetaObj,
        courseid,
        snapShot,
      })
    );

    const cols = getColumns(allCoursesChaptersObj[courseid]);

    report[courseid] = { rows, cols };
  });

  return report;
};

const getCellValue = (
  chapters: UserCoursesReportAttrs,
  chapter: ChapterArrReport
) => {
  if (chapters.stat[chapter.id]) {
    return chapters.stat[chapter.id].sum;
  } else {
    return "";
  }
};

const getCompletedInfo = ({
  completed,
  snapShotCompleted,
  chapterId,
}: {
  completed: string[];
  snapShotCompleted: string[];
  chapterId: string;
}) => {
  const isInclude = completed.includes(chapterId);
  const isIncludeSnapShot = snapShotCompleted.includes(chapterId);
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
}: {
  chapters: ChapterObjReport;
  user: GroupUserObjReportAttr;
  order: number;
  usersMetaObj: UsersMetaReport;
  courseid: string;
  snapShot: UsersMetaReport;
}) => {
  const chaptersArr = chaptersObjToArraySorted(chapters);

  const rows = chaptersArr.reduce(
    (acc, chapter, id) => ({
      ...acc,
      [`col${id + 1}`]: {
        completed: getCompletedInfo({
          completed: usersMetaObj[user.uid][courseid].completed,
          snapShotCompleted: snapShot[user.uid]
            ? snapShot[user.uid][courseid].completed
            : [],
          chapterId: chapter.id,
        }),
        sum: getCellValue(usersMetaObj[user.uid][courseid], chapter),
        maxcoins: chapter.maxcoins,
        id: order,
      },
      // id: order,
    }),
    {}
  );
  return {
    ...rows,
    col0: { sum: user.label, maxcoins: "-1", id: "-1", completed: "false" },
  };
};

const getColumns = (chapters: ChapterObjReport) => {
  let cols;
  cols = Object.keys(chapters)
    .map((chapterid) => ({
      header: `${chapters[chapterid].order}`,
      accessor: `col${chapters[chapterid].order}`,
      order: chapters[chapterid].order,
      maxcoins: chapters[chapterid].maxcoins,
      title: chapters[chapterid].title,
    }))
    .sort((a, b) => a.order - b.order);
  cols = [
    { header: "Имя", accessor: "col0", order: -1, maxcoins: -1, title: "" },
    ...cols,
  ];
  return cols;
};
