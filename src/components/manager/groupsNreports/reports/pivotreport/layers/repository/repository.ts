//DB
import {
  getMultipleDocsClient,
  setDocInSubCollectionClient,
  getDocDataFromSubCollectionByIdClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/CA/interface";

//ETL
import { extractDataNeededFromStat } from "@/components/manager/groupsNreports/reports/pivotreport/layers/repository/ETL";
import { UserMeta } from "@/types";
import { UsersMetaReport } from "@/components/manager/types";

export const saveSnapshot = ({
  userid,
  groupid,
  userMetaObj,
}: {
  userid: string;
  groupid: string;
  userMetaObj: UsersMetaReport;
}) => {
  setDocInSubCollectionClient({
    collectionName1: "snapshots",
    id1: userid,
    collectionName2: "snapshot",
    id2: groupid,
    data: userMetaObj,
  });
  // setDocInCollectionClient("snapshots", userMetaObj, `${userid}_${groupid}`);
};

export const getSnapShot = async ({
  groupid,
  userid,
}: {
  groupid: string;
  userid: string;
}) => {
  const snapshot = await getDocDataFromSubCollectionByIdClient({
    collectionName1: "snapshots",
    id1: userid,
    collectionName2: "snapshot",
    id2: groupid,
  });
  // const snapshot = await getDocDataFromCollectionByIdClient(
  //   "snapshots",
  //   `${userid}_${groupid}`
  // );
  return snapshot.data?.usersMetaObj ?? {};
};

export const getUsersMetaObj = async (
  uids: string[]
): Promise<UsersMetaReport> => {
  const usersMeta: UserMeta[] = await getMultipleDocsClient({
    collectionName: "usermeta",
    ids: uids,
  });
  return extractDataNeededFromStat(usersMeta);
};
