import S from "@/globals/settings";

//FB DB
import {
  getDocDataFromCollectionById,
  getDocFromCollectionByIdRealtime,
  updateDocByid,
  setDocInCollection,
  setDocInSubCollection,
  getMultipleDocs,
  getDocDataFromSubCollectionById,
} from "@/db/CA/firebaseCA";

//types

import { TT, CS, PS } from "@/T/typesBasic";

import {
  ChampDB,
  ChampuserDB,
  CLT,
  TaskDB,
  TasksLogDB,
  CourseChapterObjDB,
  EdgeDB,
  FlowDB,
  NodeDB,
  TaskDBWraper,
  GroupArr,
  GroupDB,
  GroupUserDBAttrs,
  UserMetaDB,
  UsersMetaReportDB,
  completedChapters,
} from "@/T/typesDB";

//ETL
import {
  groupsObjectToArr,
  groupsArrToObject,
} from "@/repository/ETL/ETLGroups";

import {
  extractUsersMetaObj,
  allTasksArrToObj,
} from "@/repository/ETL/ETLPivot";

//TODO:
import { extractChapterIdsOnly_admin } from "@/repository/ETL/ETLadmin";

//eror handling
import { throwInnerError } from "@/globals/errorMessages";

export const updateChampPoints = async ({
  pts,
  champid,
  userid,
}: {
  pts: number;
  champid: string;
  userid: string;
}) => {
  try {
    await updateDocByid<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
      data: {
        [`users.${userid}.pts`]: pts,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
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
  try {
    updateDocByid<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
      data: {
        [`users.${userid}.tasklog`]: tasklog,
        [`users.${userid}.persstatus`]: PS.champisover,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getChampTasksDB = async ({ champid }: { champid: string }) => {
  try {
    const allTasks = await getDocDataFromCollectionById<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
    });
    return allTasks?.tasks || [];
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const subscribeOnChamp = async ({
  champid,
  action,
}: {
  champid: string;
  action: (docdata: ChampDB) => void;
}) => {
  try {
    const unsubscribe = await getDocFromCollectionByIdRealtime<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
      onChangeAction: action,
    });
    //TODO: (later)test
    setInterval(() => {
      unsubscribe();
    }, S.CHAMP_SUBSCRIBE_DURATION);
  } catch (error) {
    throw throwInnerError(error);
  }
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
  try {
    await updateDocByid<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
      data: {
        [`users.${userid}`]: champuserdata,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getUserChampStatus = async ({
  userid,
  champid,
}: {
  champid: string;
  userid: string;
}) => {
  try {
    const champData = await getDocDataFromCollectionById<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
    });
    if (!champData?.users[userid]?.persstatus) {
      return PS.undefined;
    } else {
      return champData?.users[userid].persstatus;
    }
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const createNewChamp = async ({
  tasks,
  champid,
}: {
  champid: string;
  tasks: TaskDB[];
}) => {
  try {
    await setDocInCollection<ChampDB>({
      collectionName: CLT.champ,
      data: { tasks, users: {}, status: CS.created },
      id: champid,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const setChampStarted = async ({ champid }: { champid: string }) => {
  try {
    await updateDocByid<ChampDB>({
      collectionName: CLT.champ,
      id: champid,
      data: {
        status: CS.started,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

//Admin panel
export const uploadCourseChapters = async ({
  chapterFlowNodes,
  chapterFlowEdges,
  courseid,
}: {
  chapterFlowNodes: NodeDB[];
  chapterFlowEdges: EdgeDB[];
  courseid: string;
}) => {
  try {
    setDocInCollection<FlowDB>({
      collectionName: CLT.chapters,
      data: { chapterFlowNodes, chapterFlowEdges },
      id: courseid,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const uploadAllCourseTasksView = async ({
  courseid,
  allTasksAndGuidesWithLevels,
}: {
  courseid: string;
  allTasksAndGuidesWithLevels: TaskDB[];
}) => {
  try {
    const allTasksNoGuides = allTasksAndGuidesWithLevels.filter(
      (task) => task.tasktype == TT.task
    );
    await setDocInCollection({
      collectionName: CLT.newtasks,
      data: {},
      id: courseid,
    });
    await setDocInSubCollection<TaskDBWraper>({
      collectionName: CLT.newtasks,
      id: courseid,
      subCollectionName: CLT.chapters,
      subId: S.db.ALLTASKS_DOC_ID,
      data: {
        tasks: allTasksNoGuides,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const uploadChapterTasks = async ({
  courseid,
  chapterid,
  chapterTasks,
}: {
  courseid: string;
  chapterid: string;
  chapterTasks: TaskDB[];
}) => {
  try {
    setDocInSubCollection<TaskDBWraper>({
      collectionName: CLT.newtasks,
      id: courseid,
      subCollectionName: CLT.chapters,
      subId: chapterid,
      data: {
        tasks: chapterTasks,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const uploadCourseChaptersObject = async (
  chapterCourseObjectModel: CourseChapterObjDB
) => {
  try {
    await setDocInCollection<CourseChapterObjDB>({
      collectionName: CLT.views,
      data: chapterCourseObjectModel,
      id: S.db.CHAPTER_OBJ_VIEW_ID,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

//course

export const getFlowDB = async ({ courseid }: { courseid: string }) => {
  try {
    const flowDB = await getDocDataFromCollectionById<FlowDB>({
      collectionName: CLT.chapters,
      id: courseid,
    });
    //TODO: chapterFlowNodes=>nodes
    const flow = {
      nodes: flowDB?.chapterFlowNodes,
      edges: flowDB?.chapterFlowEdges,
    };
    return flow;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getChapterIds_admin = async ({
  courseid,
}: {
  courseid: string;
}) => {
  try {
    const flowDB = await getFlowDB({ courseid });
    return extractChapterIdsOnly_admin(flowDB.nodes);
  } catch (error) {
    throw throwInnerError(error);
  }
};

//groups

export const getGroupsArr = async (userid: string) => {
  const groups = await getDocDataFromCollectionById<GroupDB>({
    collectionName: CLT.groups,
    id: userid,
  });
  try {
    const data = groupsObjectToArr(groups || {});
    return data;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getChaptersObjdata = async (): Promise<CourseChapterObjDB> => {
  try {
    const chaptersObj = await getDocDataFromCollectionById<CourseChapterObjDB>({
      collectionName: CLT.views,
      id: S.db.CHAPTER_OBJ_VIEW_ID,
    });
    return chaptersObj || {};
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const addNewGroupDB = async (
  groupid: string,
  groupdata: GroupUserDBAttrs,
  uuid: string
) => {
  try {
    await updateDocByid<GroupDB>({
      collectionName: CLT.groups,
      id: uuid,
      data: {
        [`${groupid}`]: groupdata,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const updateNodeLabelDB = async (data: GroupArr[], userid: string) => {
  try {
    await setDocInCollection<GroupDB>({
      collectionName: CLT.groups,
      data: groupsArrToObject(data),
      id: userid,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
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
  try {
    const user: GroupUserDBAttrs = {
      uid,
      label: `${secondName} ${firstName}`,
      isFolder: false,
      children: {},
    };
    await updateDocByid<GroupDB>({
      collectionName: CLT.groups,
      id: manager,
      data: {
        [`${groupid}.children.${groupid + uid}`]: user,
      },
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

// pivot

export const saveSnapshot = ({
  userid,
  groupid,
  userMetaObj,
}: {
  userid: string;
  groupid: string;
  userMetaObj: UsersMetaReportDB;
}) => {
  try {
    setDocInSubCollection<UsersMetaReportDB>({
      collectionName: CLT.snapshots,
      id: userid,
      subCollectionName: CLT.snapshot,
      subId: groupid,
      data: userMetaObj,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getSnapShot = async ({
  groupid,
  userid,
}: {
  groupid: string;
  userid: string;
}) => {
  try {
    const snapshot = await getDocDataFromSubCollectionById<UsersMetaReportDB>({
      collectionName: CLT.snapshots,
      id: userid,
      subCollectionName: CLT.snapshot,
      subId: groupid,
    });

    return snapshot ?? {};
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getUsersMetaObj = async (
  uids: string[]
): Promise<UsersMetaReportDB> => {
  try {
    const usersMeta = await getMultipleDocs<UserMetaDB>({
      collectionName: CLT.usermeta,
      ids: uids,
    });
    return extractUsersMetaObj(usersMeta);
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getAllTasksDataObj = async (courseid: string) => {
  try {
    const allTasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
      collectionName: CLT.newtasks,
      id: courseid,
      subCollectionName: CLT.chapters,
      subId: S.db.ALLTASKS_DOC_ID,
    });
    return allTasksArrToObj(allTasks?.tasks);
  } catch (error) {
    throw throwInnerError(error);
  }
};

//taskset

export const getAllTasksFromChapter = async ({
  chapterid,
  courseid,
}: {
  chapterid: string;
  courseid: string;
}) => {
  try {
    const tasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
      collectionName: CLT.newtasks,
      id: courseid,
      subCollectionName: CLT.chapters,
      subId: chapterid,
    });
    return !tasks ? [] : tasks.tasks;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getTextBookTasks = async ({
  completed,
  courseid,
}: {
  completed: completedChapters;
  courseid: string;
}) => {
  try {
    const tasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
      collectionName: CLT.newtasks,
      id: courseid,
      subCollectionName: CLT.chapters,
      subId: S.db.TEXT_BOOK_TASKS_ID,
    });
    const unlockedTheory = tasks?.tasks.filter((task: TaskDB) =>
      completed.includes(task.chapterparentid)
    );
    if (!tasks) {
      return [];
    }
    return unlockedTheory;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getAllCourseTasks = async (courseid: string) => {
  try {
    const allTasks = await getDocDataFromSubCollectionById<TaskDBWraper>({
      collectionName: CLT.newtasks,
      id: courseid,
      subCollectionName: CLT.chapters,
      subId: S.db.ALLTASKS_DOC_ID,
    });
    return allTasks?.tasks;
  } catch (error) {
    throw throwInnerError(error);
  }
};

//usermeta

export const getUserMetaDataCA = async (uid: string) => {
  try {
    const userMeta = await getDocDataFromCollectionById<UserMetaDB>({
      collectionName: CLT.usermeta,
      id: uid,
    });
    return userMeta || {};
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const createNewUserMeta = async ({
  userId,
  data,
}: {
  userId: string;
  data: UserMetaDB;
}) => {
  try {
    await setDocInCollection<UserMetaDB>({
      collectionName: CLT.usermeta,
      data,
      id: userId,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};
