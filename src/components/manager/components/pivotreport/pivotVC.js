"use client";

import stat from "@/components/manager/store/stat";

import { setDocInCollectionClient } from "@/db/domain/domain";
import user from "@/store/user";

const usePivot = () => {
  const makeSnapshot = () => {
    setDocInCollectionClient(
      "snapshots",
      stat.userMetaObj,
      `${user.userid}_${stat.groupSelected}`
    );
  };

  return {
    makeSnapshot,
  };
};

export default usePivot;
