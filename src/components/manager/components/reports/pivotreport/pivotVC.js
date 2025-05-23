"use client";

import stat from "@/components/manager/store/stat";

import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  getMultipleDocsClient,
} from "@/db/domain/domain";
import user from "@/store/user";

import {
  getGroupUsersObj,
  userMetaToObject,
  chaptersObjToArray,
} from "./utils";

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

  const prepareReport = ({
    allCoursesChapters,
    usersMeta,
    usernames,
    snapShot,
  }) => {
    let report = {};
    const userMetaObj = userMetaToObject(usersMeta);
    stat.setUserMetaObj({ userMetaObj });

    Object.keys(allCoursesChapters).forEach((courseid) => {
      const rows = Object.keys(usernames).map((user, id) =>
        getRows({
          chapters: allCoursesChapters[courseid],
          user: usernames[user],
          order: id,
          userMetaObj,
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

  const showReport = async (itemId) => {
    const users = getGroupUsersObj(stat.groupsdata, itemId);
    const uids = Object.keys(users);
    if (uids) {
      const usersMeta = await getMultipleDocsClient("usermeta", uids);
      const snapShot = await getSnapShot(itemId);
      const report = prepareReport({
        allCoursesChapters: stat.chaptersobj,
        usersMeta,
        usernames: users,
        groupid: itemId,
        snapShot: snapShot ? snapShot.userMetaObj : {},
      });
      stat.setReport(report);
    }
  };

  return {
    makeSnapshot,
    showReport,
  };
};

export default usePivotReport;
