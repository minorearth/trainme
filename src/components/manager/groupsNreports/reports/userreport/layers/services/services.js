import { getReportTree } from "./utils";
import stat from "@/components/manager/groupsNreports/store/stat";
import { getUserMetaData } from "@/components/manager/groupsNreports/reports/userreport/layers/repository/repository";
import { toJS } from "mobx";

export const showUserReport = async (uid) => {
  const userMeta = await getUserMetaData(uid);
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
