"use client";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";
import user from "@/userlayers/store/user";

//repository(local)
import {
  saveSnapshot,
  getSnapShot,
  getUsersMetaObj,
} from "@/components/manager/groupsNreports/reports/pivotreport/layers/repository/repository";

//services(exterenal)
import { getGroupUsersObj } from "@/components/manager/groupsNreports/groups/layers/services/servicesTree";

//service Helpers
import { prepareReport } from "@/components/manager/groupsNreports/reports/pivotreport/layers/services/serviceHelpers";

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
    const usersMetaObj = await getUsersMetaObj(uids);
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
