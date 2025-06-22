import {
  getDocDataFromCollectionByIdClient,
  updatePoinsInChampClient,
  setTaskLogInChampClient,
  getDocDataFromSubCollectionByIdClient,
} from "@/db/domain/domain";

import { getRandomTasks } from "@/components/taskset/layers/repository/repository";
import user from "@/store/user";

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
