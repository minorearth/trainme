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
    console.log("users2", users2);
    return users2;
  };

  const prepareReport = ({ chapters, completed, usernames }) => {
    // { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
    const getRow = (chapters, rowid, user, order) => {
      const rows = Object.keys(chapters).reduce(
        (acc, chapterid, id) => ({
          ...acc,
          [`col${id + 1}`]: "V",
          id: order,
        }),
        {}
      );
      return { ...rows, col0: user.name };
    };

    let rows = Object.keys(chapters).map((courseid, rowid) =>
      Object.keys(usernames).map((user, id) =>
        getRow(chapters[courseid], rowid, usernames[user], id)
      )
    );
    let columns = Object.keys(chapters).map((courseid) =>
      Object.keys(chapters[courseid])
        .map((chapterid) => ({
          header: `${chapters[courseid][chapterid].order}`,
          accessor: `col${chapters[courseid][chapterid].order}`,
          order: chapters[courseid][chapterid].order,
        }))
        .sort((a, b) => a.order - b.order)
    );
    // columns = [...columns, { header: "Имя", accessor: "col0" }];

    return { rows, columns };
    // console.log(toJS(chapters), toJS(completed), usernames);
  };

  const showReport = async (itemId) => {
    const users = getGroupUsers(stat.groupsdata, itemId);
    const uids = Object.keys(users);
    if (uids) {
      const usersMeta = await getMultipleDocsClient("usermeta", uids);
      const report = prepareReport({
        chapters: stat.chaptersobj,
        completed: usersMeta,
        usernames: users,
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
