"use client";

import stat from "@/components/manager/groupsNreports/store/stat";
import user from "@/userlayers/store/user";

import {
  saveSnapshot,
  getSnapShot,
  getAllUserMetaObj,
} from "@/components/manager/groupsNreports/reports/pivotreport/layers/repository/repository";

import { getGroupUsersObj } from "@/components/manager/groupsNreports/groups/layers/services/servicesTree";

import { prepareReport } from "@/components/manager/groupsNreports/reports/pivotreport/layers/services/reportUtils";

export const makeSnapshot = () => {
  saveSnapshot({
    userid: user.userid,
    groupid: stat.groupSelected,
    userMetaObj: stat.snapshot,
  });
};

export const showReport = async (itemId) => {
  const users = getGroupUsersObj(itemId);
  const uids = Object.keys(users);
  if (uids) {
    const usersMetaObj = await getAllUserMetaObj(uids);
    stat.setSnapshot({ usersMetaObj });

    const snapShot = await getSnapShot({
      groupid: itemId,
      userid: user.userid,
    });

    const report = prepareReport({
      allCoursesChapters: stat.chaptersobj,
      usersMetaObj,
      usernames: users,
      groupid: itemId,
      snapShot,
    });
    stat.setReport(report);
  }
};
