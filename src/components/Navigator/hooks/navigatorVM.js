import {
  getDocDataFromCollectionByIdClient,
  updatePoinsInChampClient,
  setTaskLogInChampClient,
  getDocDataFromSubCollectionByIdClient,
} from "@/db/domain/domain";

import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";
import user from "@/store/user";

export const updateChampPoints = (pts, champid) => {
  updatePoinsInChampClient("champs", { id: user.userid, pts }, champid);
};

export const updateChampTaskLog = ({ tasklog, champid }) => {
  setTaskLogInChampClient("champs", { id: user.userid, tasklog }, champid);
};

const ETLUserProgress = (data) => {
  const stat = Object.keys(data.stat).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: {
        sum: data.stat[chapterid].sum,
      },
    }),
    {}
  );
  return {
    ...data,
    stat,
  };
};

export const getUserProgress = async (courseid) => {
  const allUserMeta = await getDataFetch({
    data: { uid: user.userid },
    type: "getusermetadata",
  });
  //TODO:keep only keys needed
  const userProgress = ETLUserProgress(allUserMeta.courses[courseid]);
  return userProgress;
};
