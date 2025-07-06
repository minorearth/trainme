import { getReportTree } from "./servicesHelpers";
import stat from "@/components/manager/groupsNreports/store/stat";
import { getUserMetaDataCA } from "@/userlayers/repository/repositoryUserMeta";
import { toJS } from "mobx";

export const showUserReport = async (uid) => {
  const userMeta = await getUserMetaDataCA(uid);
  const treeRepresent = getReportTree(
    userMeta.courses,
    stat.chaptersobj,
    stat.allCoursesTasks
  );
  stat.setCode("");
  stat.setStat(treeRepresent);
};

export const showCode = async (code) => {
  stat.setCode(code);
};
