"use client";

import stat from "@/components/manager/store/stat";

import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  getMultipleDocsClient,
} from "@/db/domain/domain";
import user from "@/store/user";

import { toJS } from "mobx";

const usePivotReport = () => {
  const makeSnapshot = () => {
    setDocInCollectionClient(
      "snapshots",
      stat.userMetaObj,
      `${user.userid}_${stat.groupSelected}`
    );
  };

  const getSnapShot = async (groupid) => {
    const snapshot = await getDocDataFromCollectionByIdClient(
      "snapshots",
      `${user.userid}_${groupid}`
    );
    return snapshot.data;
  };

  const getGroupUsers = (groupsdata, itemId) => {
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

  const showReport = async (itemId) => {
    const users = getGroupUsers(stat.groupsdata, itemId);
    const uids = Object.keys(users);
    if (uids) {
      const usersMeta = await getMultipleDocsClient("usermeta", uids);
      const snapShot = await getSnapShot(itemId);
      const report = prepareReport({
        chapters: stat.chaptersobj,
        completed: usersMeta,
        usernames: users,
        groupid: itemId,
        snapShot: snapShot ? snapShot.userMetaObj : {},
      });
      stat.setReport(report);
    }
  };

  const prepareReport = ({ chapters, completed, usernames, snapShot }) => {
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

    const userMetaToObject = (completed) => {
      const res = completed.reduce(
        (acc, user) => ({
          ...acc,
          [user.userId]: getCourseChapters(user.courses),
        }),
        {}
      );
      return res;
    };

    const chaptersObjToArray = (chapters) => {
      const res = Object.keys(chapters).map((chapterId) => ({
        chapterId,
        order: chapters[chapterId].order,
        maxcoins: chapters[chapterId].maxcoins,
      }));
      return res.sort((a, b) => a.order - b.order);
    };

    const getCellValue = (chapters, chapter) => {
      if (chapters.stat[chapter.chapterId]) {
        return chapters.stat[chapter.chapterId].sum;
      } else {
        return "";
      }
    };

    const getCompletedInfo = (userMetaObj, snapShot, chapterId) => {
      const isInclude = userMetaObj.includes(chapterId);
      const isIncludeSnapShot = snapShot.includes(chapterId);
      if (isInclude && isIncludeSnapShot) return "#1878D4";
      if (isInclude && !isIncludeSnapShot) return "#CADCEE";
      if (!isInclude && !isIncludeSnapShot) return "white";
    };

    const getRows = ({
      chapters,
      user,
      order,
      userMetaObj,
      courseid,
      snapShot,
    }) => {
      const chaptersArr = chaptersObjToArray(chapters);

      const rows = chaptersArr.reduce(
        (acc, chapter, id) => ({
          ...acc,
          [`col${id + 1}`]: {
            completed: getCompletedInfo(
              userMetaObj[user.uid][courseid].completed,
              snapShot[user.uid] ? snapShot[user.uid][courseid].completed : [],
              chapter.chapterId
            ),
            sum: getCellValue(userMetaObj[user.uid][courseid], chapter),
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

    const userMetaObj = userMetaToObject(completed);
    stat.setUserMetaObj({ userMetaObj });

    let report = {};
    Object.keys(chapters).forEach((courseid) => {
      const rows = Object.keys(usernames).map((user, id) =>
        getRows({
          chapters: chapters[courseid],
          user: usernames[user],
          order: id,
          userMetaObj,
          courseid,
          snapShot,
        })
      );
      report[courseid] = { rows };
    });

    Object.keys(chapters).map((courseid) => {
      let cols = getColumns(chapters[courseid]);
      cols = [{ header: "Имя", accessor: "col0" }, ...cols];
      report[courseid] = { ...report[courseid], cols };
    });

    return report;
  };

  return {
    makeSnapshot,
    showReport,
  };
};

export default usePivotReport;
