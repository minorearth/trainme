import stn from "@/globals/settings";

//DB
import {
  getDocDataFromCollectionByIdClient,
  getDocFromCollectionByIdRealtimeClient,
  updateDocByidClient,
  setDocInCollectionClient,
} from "@/db/CA/interface";
import { Champ, Champuser, RawTask } from "@/types";

export const updateChampPoints = async ({
  pts,
  champid,
  userid,
}: {
  pts: number;
  champid: string;
  userid: string;
}) => {
  await updateDocByidClient<Champ>("champs", champid, {
    [`users.${userid}.pts`]: pts,
  });
};

export const saveChampUserTaskLog = ({
  tasklog,
  champid,
  userid,
}: {
  tasklog: any;
  champid: string;
  userid: string;
}) => {
  updateDocByidClient("champs", champid, {
    [`users.${userid}.tasklog`]: tasklog,
    [`users.${userid}.persstatus`]: "champisover",
  });
};

export const getChampTasksDB = async ({ champid }: { champid: string }) => {
  const allTasks = await getDocDataFromCollectionByIdClient({
    collectionName: "champs",
    id: champid,
  });
  return allTasks.data?.tasks || [];
};

export const subscribeOnChamp = async ({
  champid,
  action,
}: {
  champid: string;
  action: (champdoc: any) => void;
}) => {
  const unsubscribe = await getDocFromCollectionByIdRealtimeClient<Champ>({
    collectionName: stn.collections.CHAMPS,
    id: champid,
    onChangeAction: action,
  });
  //TODO: (later)test and to Constants
  setInterval(() => {
    unsubscribe();
    // }, 1000 * 6);
  }, 1000 * 60 * 30);
};

export const updateUserInChamp = async ({
  champuserdata,
  champid,
  userid,
}: {
  champuserdata: Champuser;
  champid: string;
  userid: string;
}) => {
  await updateDocByidClient("champs", champid, {
    [`users.${userid}`]: champuserdata,
  });
};

export const getUserChampStatus = async ({
  userid,
  champid,
}: {
  champid: string;
  userid: string;
}) => {
  const champData = await getDocDataFromCollectionByIdClient({
    collectionName: stn.collections.CHAMPS,
    id: champid,
  });
  if (!champData.data?.users[userid]?.persstatus) {
    return "undefined";
  } else {
    return champData.data.users[userid].persstatus;
  }
};

export const createNewChamp = async ({
  tasks,
  champid,
}: {
  champid: string;
  tasks: RawTask[];
}) => {
  await setDocInCollectionClient({
    collectionName: stn.collections.CHAMPS,
    data: { tasks, users: [], status: "created" },
    id: champid,
  });
};

export const setChampStarted = async ({ champid }: { champid: string }) => {
  await updateDocByidClient(stn.collections.CHAMPS, champid, {
    status: "started",
  });
};
