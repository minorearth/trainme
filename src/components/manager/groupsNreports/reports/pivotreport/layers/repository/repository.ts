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
  const snapshot =
    await getDocDataFromSubCollectionById<UsersMetaReportDBWrapper>({
      collectionName1: "snapshots",
      id1: userid,
      collectionName2: "snapshot",
      id2: groupid,
    });
  // const snapshot = await getDocDataFromCollectionByIdClient(
  //   "snapshots",
  //   `${userid}_${groupid}`
  // );
  return snapshot?.usersMetaObj ?? {};
};

export const getUsersMetaObj = async (
  uids: string[]
): Promise<UsersMetaReportDB> => {
  const usersMeta = await getMultipleDocs<UserMetaDB>({
    collectionName: "usermeta",
    ids: uids,
  });
  return extractDataNeededFromStat(usersMeta);
};

export const getAllTasksDataObj = async (courseid: string) => {
  const allTasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
    collectionName1: "newtasks",
    id1: courseid,
    collectionName2: "chapters",
    id2: "alltasks",
  });
  return allTasksArrToObj(allTasks?.tasks);
};
