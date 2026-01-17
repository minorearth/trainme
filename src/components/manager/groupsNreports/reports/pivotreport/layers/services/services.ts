"use client";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";
import user from "@/auth/store/user";

//repository(local)
import {
  saveSnapshot,
  getSnapShot,
  getUsersMetaObj,
} from "@/tpconst/src/RP/FB";

//services(exterenal)
import { getGroupUsersObj } from "@/components/manager/groupsNreports/groups/layers/services/servicesTree";

//service Helpers
import { makeReport } from "@/components/manager/groupsNreports/reports/pivotreport/layers/services/serviceHelpers";

export const makeSnapshot = () => {
  saveSnapshot({
    userid: user.userid,
    groupid: stat.groupSelectedId,
    userMetaObj: stat.snapshot,
  });
};

export const showReport = async (groupId: string) => {
  const groupUsersObj = getGroupUsersObj(groupId);
  const uids = Object.keys(groupUsersObj);
  if (uids) {
    const usersMetaObj = await getUsersMetaObj(uids);
    stat.setSnapshot(usersMetaObj);

    const snapShot = await getSnapShot({
      groupid: groupId,
      userid: user.userid,
    });

    const report = makeReport({
      allCoursesChaptersObj: stat.chaptersobj,
      usersMetaObj,
      groupUsersObj,
      snapShot,
    });
    stat.setReport(report);
  }
};
