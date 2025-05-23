import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

import { getReportTree } from "@/components/manager/utils";
import stat from "@/components/manager/store/stat";

export const useUserReport = () => {
  const showUserReport = async (uid) => {
    const userMeta = await getDocDataFromCollectionByIdClient("usermeta", uid);
    const treeRepresent = getReportTree(
      userMeta.data.courses,
      stat.chaptersobj
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
