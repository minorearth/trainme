//DB
import {
  setDocInCollection,
  getDocDataFromCollectionById,
  updateDocByid,
} from "@/db/CA/firebaseCA";

//ETL
import {
  groupsObjectToArr,
  groupsArrToObject,
} from "@/components/manager/groupsNreports/groups/layers/repository/ETL";

import { CourseChapterObjReport } from "@/T/Managertypes";
import { GroupArr, GroupDB, GroupUserDBAttrs } from "@/T/typesDB";

export const getGroupsArr = async (userid: string) => {
  const groups = await getDocDataFromCollectionById<GroupDB>({
    collectionName: "groups",
    id: userid,
  });
  const data = groupsObjectToArr(groups || {});
  return data;
};

export const getChaptersObjdata = async (): Promise<CourseChapterObjReport> => {
  const chaptersObj =
    await getDocDataFromCollectionById<CourseChapterObjReport>({
      collectionName: "views",
      id: "chaptersobject",
    });
  return chaptersObj || {};
};

export const addNewGroupDB = async (data: GroupArr[], userid: string) => {
  await setDocInCollection<GroupDB>({
    collectionName: "groups",
    data: groupsArrToObject(data),
    id: userid,
  });
};

export const updateNodeLabelDB = async (data: GroupArr[], userid: string) => {
  await setDocInCollection<GroupDB>({
    collectionName: "groups",
    data: groupsArrToObject(data),
    id: userid,
  });
};

export const addUserToGroup = async ({
  groupid,
  secondName,
  firstName,
  manager,
  uid,
}: {
  groupid: string;
  secondName: string;
  firstName: string;
  manager: string;
  uid: string;
}) => {
  const user: GroupUserDBAttrs = {
    uid,
    label: `${secondName} ${firstName}`,
    isFolder: false,
    children: {},
  };
  await updateDocByid<GroupArr>("groups", manager, {
    [`${groupid}.children.${groupid + uid}`]: user,
  });
};
