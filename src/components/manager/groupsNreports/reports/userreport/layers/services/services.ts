import { getReportTree } from "./servicesHelpers";
import stat from "@/components/manager/groupsNreports/store/stat";
import { getUserMetaDataCA } from "@/userlayers/repository/repositoryUserMeta";
import { toJS } from "mobx";

export const showUserReport = async (uid: string) => {
  const userMeta = await getUserMetaDataCA(uid);
  const treeRepresent = getReportTree(
    userMeta.courses,
    stat.chaptersobj,
    stat.allCoursesTasksObj
  );
  stat.setCode("");
  stat.setUserStat(treeRepresent);
};

export const showCode = async (code: string) => {
  stat.setCode(code);
};
