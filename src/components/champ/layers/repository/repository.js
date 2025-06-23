import {
  getDocDataFromCollectionByIdClient,
  updatePoinsInChampClient,
  setTaskLogInChampClient,
} from "@/db/domain/domain";

import user from "@/userlayers/store/user";

export const updateChampPoints = (pts, champid) => {
  updatePoinsInChampClient("champs", { id: user.userid, pts }, champid);
};

export const updateChampTaskLog = ({ tasklog, champid }) => {
  setTaskLogInChampClient("champs", { id: user.userid, tasklog }, champid);
};

export const getChampTasks = async ({ champid }) => {
  const allTasks = await getDocDataFromCollectionByIdClient("champs", champid);
  return allTasks;
};
