import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

import { getReportTree } from "./utils";
import stat from "@/components/manager/store/stat";
import { toJS } from "mobx";

export const useUserReport = () => {
  const showUserReport = async (uid) => {
    const userMeta = await getDocDataFromCollectionByIdClient("usermeta", uid);
    const treeRepresent = getReportTree(
      userMeta.data.courses,
      stat.chaptersobj,
      stat.allCoursesTasks
    );
    stat.setCode("");
    stat.setStat(treeRepresent);
  };

  const showCode = async (code) => {
    stat.setCode(code);
  };

  return {
    showUserReport,
    showCode,
  };
};
