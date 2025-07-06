//DB
import {
  getMultipleDocsClient,
  setDocInSubCollectionClient,
  getDocDataFromSubCollectionByIdClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/CA/interface";

//ETL
import { extractDataNeededFromStat } from "@/components/manager/groupsNreports/reports/pivotreport/layers/repository/ETL";

export const saveSnapshot = ({ userid, groupid, userMetaObj }) => {
  setDocInSubCollectionClient(
    "snapshots",
    userid,
    "snapshot",
    groupid,
    userMetaObj
  );
  // setDocInCollectionClient("snapshots", userMetaObj, `${userid}_${groupid}`);
};

export const getSnapShot = async ({ groupid, userid }) => {
  const snapshot = await getDocDataFromSubCollectionByIdClient(
    "snapshots",
    userid,
    "snapshot",
    groupid
  );
  // const snapshot = await getDocDataFromCollectionByIdClient(
  //   "snapshots",
  //   `${userid}_${groupid}`
  // );
  return snapshot.data?.usersMetaObj ?? {};
};

export const getUsersMetaObj = async (uids) => {
  const usersMeta = await getMultipleDocsClient("usermeta", uids);
  return extractDataNeededFromStat(usersMeta);
};
