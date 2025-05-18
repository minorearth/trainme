// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import { useEffect } from "react";
import { toJS } from "mobx";

import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  getMultipleDocsClient,
} from "@/db/domain/domain";
import user from "@/store/user";
import { courses, getReadyCourses } from "@/globals/courses";

import { allTasksToObject, getTreeRepresent } from "@/components/manager/utils";
import stat from "@/components/manager/store/stat";

export const useGroupsTreeitem = ({ itemId, uid }) => {
  const copyGroupLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_DOMAIN}/joingroup/${itemId}/${user.userid}`
    );
  };

  const showUserMeta = async () => {
    const userMeta = await getDocDataFromCollectionByIdClient("usermeta", uid);
    const treeRepresent = getTreeRepresent(
      userMeta.data.courses,
      stat.chaptersobj
    );
    stat.setStat(treeRepresent);
  };

  const getGroupUsers = (groupsdata, itemId) => {
    const group = groupsdata.filter((item) => item.id == itemId)[0];
    const users = group.children.map((item) => item.uid);
    const users2 = group.children.reduce(
      (acc, item) => ({
        ...acc,
        [item.uid]: { name: item.label, uid: item.uid },
      }),
      {}
    );
    return users2;
  };

  const prepareReport = ({
    chapters,
    completed,
    usernames,
    groupid,
    snapShot,
  }) => {
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
      if (isInclude && isIncludeSnapShot) return "green";
      if (isInclude && !isIncludeSnapShot) return "yellow";
      if (!isInclude && !isIncludeSnapShot) return "blue";
    };

    const getRows = (
      chapters,
      rowid,
      user,
      order,
      userMetaObj,
      courseid,
      snapShot
    ) => {
      const chaptersArr = chaptersObjToArray(chapters);
      console.log("ss", snapShot);
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
      // const rows = Object.keys(chapters).reduce(
      //   (acc, chapterid, id) => ({
      //     ...acc,
      //     [`col${id + 1}`]: userMetaObj[user.uid][courseid].completed.includes(
      //       chapterid
      //     )
      //       ? "V"
      //       : "",
      //     id: order,
      //   }),
      //   {}
      // );
      return { ...rows, col0: { sum: user.name } };
    };

    const getColumns = (chapters) => {
      return Object.keys(chapters)
        .map((chapterid) => ({
          header: `${chapters[chapterid].order}`,
          accessor: `col${chapters[chapterid].order}`,
          order: chapters[chapterid].order,
          maxcoins: chapters[chapterid].maxcoins,
        }))
        .sort((a, b) => a.order - b.order);
    };

    const userMetaObj = userMetaToObject(completed);
    stat.setUserMetaObj({ userMetaObj });

    let report = {};
    Object.keys(chapters).forEach((courseid, rowid) => {
      const rows = Object.keys(usernames).map((user, id) =>
        getRows(
          chapters[courseid],
          rowid,
          usernames[user],
          id,
          userMetaObj,
          courseid,
          snapShot
        )
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

  const getSnapShot = async (groupid) => {
    const snapshot = await getDocDataFromCollectionByIdClient(
      "snapshots",
      `${user.userid}_${groupid}`
    );
    return snapshot.data;
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

  return {
    showUserMeta,
    copyGroupLink,
    showReport,
  };
};
