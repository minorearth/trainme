import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  getMultipleDocsClient,
  setDocInSubCollectionClient,
} from "@/db/domain/domain";

import { allUsersMetaToObject } from "@/components/manager/groupsNreports/reports/pivotreport/layers/repository/ETL";

export const saveSnapshot = ({ userid, groupid, userMetaObj }) => {
  setDocInSubCollectionClient(
    "snapshots",
    userid,
    "snapshot",
    groupid,
    userMetaObj
  );
  setDocInCollectionClient("snapshots", userMetaObj, `${userid}_${groupid}`);
};

export const getSnapShot = async ({ groupid, userid }) => {
  const snapshot = await getDocDataFromCollectionByIdClient(
    "snapshots",
    `${userid}_${groupid}`
  );
  return snapshot.data?.userMetaObj ?? {};
};

export const getAllUserMetaObj = async (uids) => {
  const usersMeta = await getMultipleDocsClient("usermeta", uids);
  return allUsersMetaToObject(usersMeta);
};
