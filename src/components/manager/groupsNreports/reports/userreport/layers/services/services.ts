import { getReportTree } from "./servicesHelpers";
import stat from "@/components/manager/groupsNreports/store/stat";
import { getUserMetaDataCA } from "@/tpconst/src/RP/FB";
import { toJS } from "mobx";

export const showUserReport = async (uid: string) => {
  const userMeta = await getUserMetaDataCA(uid);
  const treeRepresent = getReportTree({
    userstat: userMeta.courses,
    chaptersobj: stat.chaptersobj,
    allCoursesTasks: stat.allCoursesTasksObj,
  });
  stat.setCode("");
  stat.setUserStat(treeRepresent);
};
