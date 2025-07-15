//DB
import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  updateDocByidClient,
} from "@/db/CA/interface";

//ETL
import {
  groupsObjectToArr,
  groupsArrToObject,
} from "@/components/manager/groupsNreports/groups/layers/repository/ETL";

import { Group, GroupObj, GroupUserObjAttrs } from "@/components/manager/types";

import { CourseChapterObjReport } from "@/components/manager/types";

export const getGroupsArr = async (userid: string) => {
  const groups = await getDocDataFromCollectionByIdClient({
    collectionName: "groups",
    id: userid,
  });
  const data = groupsObjectToArr(groups.data as GroupObj);
  return data;
};

export const getChaptersObjdata = async (): Promise<CourseChapterObjReport> => {
  const chaptersObj = await getDocDataFromCollectionByIdClient({
    collectionName: "views",
    id: "chaptersobject",
  });
  return chaptersObj.data || {};
};

export const addNewGroupDB = async (data: Group[], userid: string) => {
  await setDocInCollectionClient({
    collectionName: "groups",
    data: groupsArrToObject(data),
    id: userid,
  });
};

export const updateNodeLabelDB = async (data: Group[], userid: string) => {
  await setDocInCollectionClient({
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
  const user: GroupUserObjAttrs = {
    uid,
    label: `${secondName} ${firstName}`,
    isFolder: false,
    children: [],
  };
  await updateDocByidClient<Group>("groups", manager, {
    [`${groupid}.children.${groupid + uid}`]: user,
  });
};
