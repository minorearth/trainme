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

import {
  CourseChapterObjDB,
  GroupArr,
  GroupDB,
  GroupUserDBAttrs,
} from "@/T/typesDB";

export const getGroupsArr = async (userid: string) => {
  const groups = await getDocDataFromCollectionById<GroupDB>({
    collectionName: "groups",
    id: userid,
  });
  const data = groupsObjectToArr(groups || {});
  return data;
};

export const getChaptersObjdata = async (): Promise<CourseChapterObjDB> => {
  const chaptersObj = await getDocDataFromCollectionById<CourseChapterObjDB>({
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

export const addNewGroupDB2 = async (
  groupid: string,
  groupdata: GroupUserDBAttrs,
  uuid: string
) => {
  await updateDocByid<GroupDB>("groups", uuid, {
    [`${groupid}`]: groupdata,
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
  await updateDocByid<GroupDB>("groups", manager, {
    [`${groupid}.children.${groupid + uid}`]: user,
  });
};
