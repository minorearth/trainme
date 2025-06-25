import {
  getDocDataFromCollectionByIdClient,
  updatePoinsInChampClient,
  setTaskLogInChampClient,
  getDocFromCollectionByIdRealtimeClient,
  updateUsersInChampClient,
  updateDocByidClient,
  setDocInCollectionClient,
} from "@/db/domain/domain";

import stn from "@/globals/settings";

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

export const subscribeOnChamp = async ({ champid, action }) => {
  console.log("users monitoring started", champid);
  const unsubscribe = await getDocFromCollectionByIdRealtimeClient(
    stn.collections.CHAMPS,
    champid,
    action
  );
  //TODO: test
  setInterval(() => {
    unsubscribe();
    // }, 1000 * 6);
  }, 1000 * 60 * 30);
};

export const updateUserInChamp = async ({ data, champid }) => {
  await updateUsersInChampClient(stn.collections.CHAMPS, data, champid);
};

export const getUserChampStatus = async ({ userid, champid }) => {
  const champData = await getDocDataFromCollectionByIdClient(
    stn.collections.CHAMPS,
    champid
  );
  if (!champData.data.users[userid]?.persstatus) {
    return "undefined";
  } else {
    return champData.data.users[userid].persstatus;
  }
};

export const createNewChamp = async ({ tasks, champid }) => {
  await setDocInCollectionClient(
    stn.collections.CHAMPS,
    { tasks, users: [], status: "created" },
    champid
  );
};

export const setChampStarted = async ({ champid }) => {
  await updateDocByidClient(stn.collections.CHAMPS, champid, {
    status: "started",
  });
};
