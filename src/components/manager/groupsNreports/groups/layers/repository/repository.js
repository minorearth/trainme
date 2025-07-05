import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  getDocDataFromSubCollectionByIdClient,
  updateDocByidClient,
} from "@/db/CA/interface";

import {
  allTasksArrToObj,
  groupsObjectToArr,
  groupsArrToObject,
} from "@/components/manager/groupsNreports/groups/layers/repository/ETL";

export const getAllTasksData = async (courseid) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );
  return allTasksArrToObj(allTasks);
};

export const getGroupsObj = async (userid) => {
  const groups = await getDocDataFromCollectionByIdClient("groups", userid);
  const data = groupsObjectToArr(groups.data);
  return data;
};

export const getChaptersObjdata = async () => {
  const chaptersObj = await getDocDataFromCollectionByIdClient(
    "views",
    "chaptersobject"
  );
  return chaptersObj.data;
};

export const addNewGroupDB = async (data, userid) => {
  await setDocInCollectionClient("groups", groupsArrToObject(data), userid);
};

export const updateNodeLabelDB = async (newdata, userid) => {
  await setDocInCollectionClient("groups", groupsArrToObject(newdata), userid);
};

//TODO: remove
export const addUserToGroup = async ({
  groupid,
  secondName,
  firstName,
  manager,
  uid,
}) => {
  await updateDocByidClient("groups", manager, {
    [`${groupid}.children.${groupid + uid}`]: {
      uid,
      label: `${secondName} ${firstName}`,
      isFolder: false,
    },
  });
};
