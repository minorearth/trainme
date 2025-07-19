import S from "@/globals/settings";

//DB
import {
  getDocDataFromCollectionById,
  getDocFromCollectionByIdRealtime,
  updateDocByid,
  setDocInCollection,
} from "@/db/CA/firebaseCA";
import { ChampDB, ChampuserDB, CLT, TaskDB, TasksLogDB } from "@/T/typesDB";
import { CS, CT, PS } from "@/T/typesBasic";

export const updateChampPoints = async ({
  pts,
  champid,
  userid,
}: {
  pts: number;
  champid: string;
  userid: string;
}) => {
  await updateDocByid<ChampDB>({
    collectionName: CLT.champ,
    id: champid,
    data: {
      [`users.${userid}.pts`]: pts,
    },
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
  updateDocByid<ChampDB>({
    collectionName: CLT.champ,
    id: champid,
    data: {
      [`users.${userid}.tasklog`]: tasklog,
      [`users.${userid}.persstatus`]: PS.champisover,
    },
  });
};

export const getChampTasksDB = async ({ champid }: { champid: string }) => {
  const allTasks = await getDocDataFromCollectionById<ChampDB>({
    collectionName: CLT.champ,
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
    collectionName: CLT.champ,
    id: champid,
    onChangeAction: action,
  });
  //TODO: (later)test
  setInterval(() => {
    unsubscribe();
  }, S.CHAMP_SUBSCRIBE_DURATION);
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
  await updateDocByid<ChampDB>({
    collectionName: CLT.champ,
    id: champid,
    data: {
      [`users.${userid}`]: champuserdata,
    },
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
    collectionName: CLT.champ,
    id: champid,
  });
  if (!champData?.users[userid]?.persstatus) {
    return PS.undefined;
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
    collectionName: CLT.champ,
    data: { tasks, users: {}, status: CS.created },
    id: champid,
  });
};

export const setChampStarted = async ({ champid }: { champid: string }) => {
  await updateDocByid<ChampDB>({
    collectionName: CLT.champ,
    id: champid,
    data: {
      status: CS.started,
    },
  });
};
