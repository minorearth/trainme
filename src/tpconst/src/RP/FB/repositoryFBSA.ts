"use server";
//DB
import {
  checkCoursePaidSA,
  checkCoursePaidSA2,
  getDocSA,
  updateDocSA,
  setDocSA,
} from "../../DB/FB/SA";

import { v4 as uuidv4 } from "uuid";

//utils
import { decrypt2 } from "../../utils";
import {
  E_CODES_DIALOG,
  throwInnerErrorCause,
  throwInnerError,
} from "../../errorHandlers";
import { CourseProgressDB, UserCoursesDB, UserMetaDB } from "../../T";
import { CLT } from "../../const";
import { ETLUserProgress, taskLogToDBFormat } from "./ETL";

const courses: {
  [key: string]: { firstchapter: string; free: boolean };
} = {
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0": {
    firstchapter: "4680f00b-b586-413c-890a-9669b4b7b1c3",
    free: true,
  },
  "a3905595-437e-47f3-b749-28ea5362bd39": {
    firstchapter: "1185fbd6-1e7f-450c-9311-6870e8e137bd",
    free: true,
  },
  "08d00469-b5c5-4bdc-8c7c-4971e3dd502f": {
    firstchapter: "89af18a6-dfbf-4dc4-b358-43bd31849fa4",
    free: true,
  },
  "fb722ffe-a838-4e70-8467-423f418af2c8": {
    firstchapter: "05260422-da89-4350-8d4c-db19ab21baae",
    free: true,
  },
};

const decryptData2 = (dataEncrypted: string) => {
  try {
    const decyptedData = decrypt2(dataEncrypted);
    return decyptedData;
  } catch (error) {
    throw throwInnerError(new Error(E_CODES_DIALOG.DECRYPTION_FAILED));
  }
};

interface InputDataNotEncypted<T> {
  id: string;
  data: Partial<T>;
}

// setters
export async function resetUser(dataEncrypted: string) {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;

  try {
    const { uid, courseid } = decryptData2(dataEncrypted);
    datanotencrypted = {
      data: {
        [`courses.${courseid}`]: {
          completed: [],
          unlocked: [courses[courseid].firstchapter],
          lastunlocked: [courses[courseid].firstchapter],
          paid: [],
          stat: {},
          rating: 0,
        },
      },
      id: uid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }
  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
}

export const unlockAllChaptersDBSA = async (dataEncrypted: string) => {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;
  try {
    const { courseid, chaptersIds, userid } = decryptData2(dataEncrypted);

    datanotencrypted = {
      data: {
        [`courses.${courseid}.completed`]: [],
        [`courses.${courseid}.unlocked`]: chaptersIds,
        [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
      },
      id: userid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const completeAllChaptersDBSA = async (dataEncrypted: string) => {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;
  try {
    const { courseid, chaptersIds, userid } = decryptData2(dataEncrypted);

    datanotencrypted = {
      data: {
        [`courses.${courseid}.completed`]: chaptersIds,
        [`courses.${courseid}.unlocked`]: chaptersIds,
        [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
        [`courses.${courseid}.paid`]: chaptersIds,
      },
      id: userid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const setMoneyDBSA = async (dataEncrypted: string) => {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;
  try {
    const { courseid, inValue, userid } = decryptData2(dataEncrypted);

    datanotencrypted = {
      data: { [`courses.${courseid}.rating`]: Number(inValue) },
      id: userid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const paychapterDBSA = async ({
  dataEncrypted,
}: {
  dataEncrypted: string;
}) => {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;
  try {
    const { rating, lastunlocked, paid, courseid, userid } =
      decryptData2(dataEncrypted);

    datanotencrypted = {
      data: {
        [`courses.${courseid}.rating`]: rating,
        [`courses.${courseid}.lastunlocked`]: lastunlocked,
        [`courses.${courseid}.paid`]: paid,
      },
      id: userid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const saveProgressDBSAFull = async ({
  dataEncrypted,
}: {
  dataEncrypted: string;
}) => {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;
  try {
    const {
      rating,
      tasklog,
      courseid,
      userid,
      sum,
      chapterid,
      unlocked,
      lastunlocked,
      completed,
    } = decryptData2(dataEncrypted);
    const tasklogPrepared = taskLogToDBFormat({
      courseid,
      lastcompleted: chapterid,
      tasklog,
    });
    datanotencrypted = {
      data: {
        [`courses.${courseid}.rating`]: rating,
        [`courses.${courseid}.stat.${chapterid}.sum`]: sum,
        [`courses.${courseid}.completed`]: completed,
        //all unlocked chapters(more than completed by lastunlocked)
        [`courses.${courseid}.unlocked`]: unlocked,
        //next chapters after just completed
        [`courses.${courseid}.lastunlocked`]: lastunlocked,
        ...tasklogPrepared,
      },
      id: userid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const saveProgressDBSA = async ({
  dataEncrypted,
}: {
  dataEncrypted: string;
}) => {
  let datanotencrypted: InputDataNotEncypted<UserMetaDB>;
  try {
    const { rating, tasklog, courseid, userid, sum, chapterid } =
      decryptData2(dataEncrypted);
    const tasklogPrepared = taskLogToDBFormat({
      courseid,
      lastcompleted: chapterid,
      tasklog,
    });
    datanotencrypted = {
      data: {
        [`courses.${courseid}.rating`]: rating,
        [`courses.${courseid}.stat.${chapterid}.sum`]: sum,
        ...tasklogPrepared,
      },
      id: userid,
    };
  } catch (error) {
    throw throwInnerError(error);
  }

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const buyCourseDBSA = async ({
  uid,
  courseid,
}: {
  uid: string;
  courseid: string;
}) => {
  const datanotencrypted = {
    data: {
      [`paidcourses2.${courseid}`]: true,
    },
    id: uid,
  };

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

// getters
export const getUserMetaDBSA = async (id: string) => {
  const data = await getDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    id,
  });
  return data;
};

//TODO:moveToSpecific file
export const getPaymentIdDBSA = async (data: string) => {
  const myHeaders = new Headers();

  const user = "1138711";
  const password = "test_U5BQCbtM-8EbukKeHySB89i58dxNUV4O0_QzxK0vq2Q";
  const idempotenceKey = uuidv4();

  myHeaders.append("Idempotence-Key", idempotenceKey);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Basic ${btoa(`${user}:${password}`)}`);
  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.yookassa.ru/v3/payments",
    requestOptions,
  );
  const res = await response.json();
  return res.confirmation.confirmation_token;
};

export const getUserCourseMetaDBSA = async (id: string, courseid: string) => {
  try {
    const data = await getDocSA<UserMetaDB>({
      collectionName: CLT.usermeta,
      id,
    });
    let userProgress: CourseProgressDB;
    try {
      if (!data.courses[courseid]) {
        await updateUserCourseDefaults({
          courseid,
          userid: id,
        });
        return ETLUserProgress({
          lastunlocked: [courses[courseid].firstchapter],
          unlocked: [courses[courseid].firstchapter],
          completed: [],
          paid: [],
          stat: {},
          rating: 0,
        });
      }
      userProgress = ETLUserProgress(data.courses[courseid]);
    } catch (error) {
      throw throwInnerErrorCause(
        E_CODES_DIALOG.PROCEDURE_ERROR,
        "ETLUserProgress",
      );
    }
    return userProgress;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const checkCoursePaidDBSA = async (courseid: string, uid: string) => {
  const freeIds = getFreeCoursesIds();
  console.log(freeIds, courseid);
  if (freeIds.includes(courseid)) {
    return true;
  }
  const value = await checkCoursePaidSA(courseid, uid);
  return value;
};

// export const createNewUserMeta = async ({
//   userId,
//   data,
// }: {
//   userId: string;
//   data: UserMetaDB;
// }) => {
//   try {
//     await setDocInCollection<UserMetaDB>({
//       collectionName: CLT.usermeta,
//       data,
//       id: userId,
//     });
//   } catch (error) {
//     throw throwInnerError(error);
//   }
// };

const getFreeCourses = () => {
  const res = Object.keys(courses)
    .filter((courseId) => courses[courseId].free)
    .reduce((acc, courseId) => ({ ...acc, [courseId]: courses[courseId] }), {});
  return res as {
    [key: string]: { firstchapter: string; free: boolean };
  };
};

//TODO: assign type to all reducers ex. {} as UserCoursesDB
const getInitalDataForFreeCourses = (): UserCoursesDB => {
  const freeCourses = getFreeCourses();

  return Object.keys(freeCourses).reduce(
    (acc, courseid) => ({
      ...acc,
      [courseid]: {
        lastunlocked: [freeCourses[courseid].firstchapter],
        unlocked: [freeCourses[courseid].firstchapter],
        completed: [],
        paid: [],
        stat: {},
        rating: 0,
      },
    }),
    {} as UserCoursesDB,
  );
};

const getFreeCoursesIds = (): string[] => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

export const createNewUserMeta = async ({
  uid,
  name,
}: {
  uid: string;
  name: string;
}) => {
  const freecoursesIds = getFreeCoursesIds();
  const coursesInitials = getInitalDataForFreeCourses();
  const data = {
    name,
    userId: uid,
    paidcourses: freecoursesIds,
    courses: coursesInitials,
    paidcourses2: {},
  };

  const datanotencrypted = {
    data,
    id: uid,
  };

  try {
    await setDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export async function updateUserCourseDefaults({
  courseid,
  userid,
}: {
  courseid: string;
  userid: string;
}) {
  const data = {
    [`courses.${courseid}`]: {
      lastunlocked: [courses[courseid].firstchapter],
      unlocked: [courses[courseid].firstchapter],
      completed: [],
      paid: [],
      stat: {},
      rating: 0,
    },
  };

  const datanotencrypted = {
    data,
    id: userid,
  };

  try {
    await updateDocSA<Partial<UserMetaDB>>({
      collectionName: CLT.usermeta,
      datanotencrypted,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
}
