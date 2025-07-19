//DB
import {
  getMultipleDocs,
  setDocInSubCollection,
  getDocDataFromSubCollectionById,
} from "@/db/CA/firebaseCA";

//ETL
import {
  extractDataNeededFromStat,
  allTasksArrToObj,
} from "@/components/manager/groupsNreports/reports/pivotreport/layers/repository/ETL";
import {
  CLT,
  TaskDB,
  TaskDBWraper,
  UserMetaDB,
  UsersMetaReportDB,
  UsersMetaReportDBWrapper,
} from "@/T/typesDB";

export const saveSnapshot = ({
  userid,
  groupid,
  userMetaObj,
}: {
  userid: string;
  groupid: string;
  userMetaObj: UsersMetaReportDB;
}) => {
  setDocInSubCollection<UsersMetaReportDB>({
    collectionName: CLT.snapshots,
    id: userid,
    subCollectionName: CLT.snapshot,
    subId: groupid,
    data: userMetaObj,
  });
};

export const getSnapShot = async ({
  groupid,
  userid,
}: {
  groupid: string;
  userid: string;
}) => {
  const snapshot = await getDocDataFromSubCollectionById<UsersMetaReportDB>({
    collectionName: CLT.snapshots,
    id: userid,
    subCollectionName: CLT.snapshot,
    subId: groupid,
  });

  return snapshot ?? {};
};

export const getUsersMetaObj = async (
  uids: string[]
): Promise<UsersMetaReportDB> => {
  const usersMeta = await getMultipleDocs<UserMetaDB>({
    collectionName: CLT.usermeta,
    ids: uids,
  });
  return extractDataNeededFromStat(usersMeta);
};

export const getAllTasksDataObj = async (courseid: string) => {
  const allTasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName: CLT.newtasks,
    id: courseid,
    subCollectionName: CLT.chapters,
    subId: "alltasks",
  });
  return allTasksArrToObj(allTasks?.tasks);
};
