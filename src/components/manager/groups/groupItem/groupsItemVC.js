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

  const prepareReport = ({ chapters, completed, usernames }) => {
    console.log("completed", completed);

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
      console.log("asdasdasd", res);
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
      }));
      return res.sort((a, b) => a.order - b.order);
    };

    const getCellValue = (chapters, chapterId) => {
      console.log("stst", chapters.stat);
      if (chapters.stat[chapterId]) {
        return chapters.stat[chapterId].sum;
      } else {
        return 0;
      }
    };

    const getRow = (chapters, rowid, user, order, userMetaObj, courseid) => {
      const chaptersArr = chaptersObjToArray(chapters);
      console.log("chaptersArr", chaptersArr);
      console.log("chapters", toJS(chapters));
      const rows = chaptersArr.reduce(
        (acc, chapter, id) => ({
          ...acc,
          [`col${id + 1}`]: {
            completed: userMetaObj[user.uid][courseid].completed.includes(
              chapter.chapterId
            ),
            sum: getCellValue(
              userMetaObj[user.uid][courseid],
              chapter.chapterId
            ),
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
        }))
        .sort((a, b) => a.order - b.order);
    };
    const userMetaObj = userMetaToObject(completed);

    let report = {};
    Object.keys(chapters).forEach((courseid, rowid) => {
      const rows = Object.keys(usernames).map((user, id) =>
        getRow(
          chapters[courseid],
          rowid,
          usernames[user],
          id,
          userMetaObj,
          courseid
        )
      );
      report[courseid] = { rows };
    });

    Object.keys(chapters).map((courseid) => {
      let cols = getColumns(chapters[courseid]);
      cols = [{ header: "Имя", accessor: "col0" }, ...cols];
      report[courseid] = { ...report[courseid], cols };
    });

    console.log("userMetaObj", userMetaObj);

    return report;
    // console.log(toJS(chapters), toJS(completed), usernames);
  };

  const showReport = async (itemId) => {
    const users = getGroupUsers(stat.groupsdata, itemId);
    console.log(users, "users");
    const uids = Object.keys(users);
    if (uids) {
      const usersMeta = await getMultipleDocsClient("usermeta", uids);
      const report = prepareReport({
        chapters: stat.chaptersobj,
        completed: usersMeta,
        usernames: users,
      });
      console.log("report", report);

      stat.setReport(report);
    }
  };

  return {
    showUserMeta,
    copyGroupLink,
    showReport,
  };
};
