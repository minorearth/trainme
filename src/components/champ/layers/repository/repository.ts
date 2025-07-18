import stn from "@/globals/settings";

//DB
import {
  getDocDataFromCollectionById,
  getDocFromCollectionByIdRealtime,
  updateDocByid,
  setDocInCollection,
} from "@/db/CA/firebaseCA";
import { ChampDB, ChampuserDB, TaskDB, TasksLogDB } from "@/T/typesDB";

export const updateChampPoints = async ({
  pts,
  champid,
  userid,
}: {
  pts: number;
  champid: string;
  userid: string;
}) => {
  await updateDocByid<ChampDB>("champs", champid, {
    [`users.${userid}.pts`]: pts,
  });
};

export const saveChampUserTaskLog = ({
  tasklog,
  champid,
  userid,
}: {
  tasklog: TasksLogDB;
  champid: string;
  userid: string;
}) => {
  updateDocByid<ChampDB>("champs", champid, {
    [`users.${userid}.tasklog`]: tasklog,
    [`users.${userid}.persstatus`]: "champisover",
  });
};

export const getChampTasksDB = async ({ champid }: { champid: string }) => {
  const allTasks = await getDocDataFromCollectionById<ChampDB>({
    collectionName: "champs",
    id: champid,
  });
  return allTasks?.tasks || [];
};

export const subscribeOnChamp = async ({
  champid,
  action,
}: {
  champid: string;
  action: (docdata: ChampDB) => void;
}) => {
  const unsubscribe = await getDocFromCollectionByIdRealtime<ChampDB>({
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
  champuserdata: ChampuserDB;
  champid: string;
  userid: string;
}) => {
  await updateDocByid<ChampDB>("champs", champid, {
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
  const champData = await getDocDataFromCollectionById<ChampDB>({
    collectionName: stn.collections.CHAMPS,
    id: champid,
  });
  if (!champData?.users[userid]?.persstatus) {
    return "undefined";
  } else {
    return champData?.users[userid].persstatus;
  }
};

export const createNewChamp = async ({
  tasks,
  champid,
}: {
  champid: string;
  tasks: TaskDB[];
}) => {
  await setDocInCollection<ChampDB>({
    collectionName: stn.collections.CHAMPS,
    data: { tasks, users: {}, status: "created" },
    id: champid,
  });
};

export const setChampStarted = async ({ champid }: { champid: string }) => {
  await updateDocByid<ChampDB>(stn.collections.CHAMPS, champid, {
    status: "started",
  });
};
