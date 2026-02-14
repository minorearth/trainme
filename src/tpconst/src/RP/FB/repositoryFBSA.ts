//DB
import {
  checkCoursePaidSA,
  checkCoursePaidSA2,
  getDocSA,
  updateDocSA,
} from "../../DB/FB/SA";

import { v4 as uuidv4 } from "uuid";

//utils
import { decrypt2 } from "../../utils";
import {
  E_CODES_DIALOG,
  throwInnerErrorCause,
  throwInnerError,
} from "../../errorHandlers";
import { CourseProgressDB, UserMetaDB } from "../../T";
import { CLT } from "../../const";
import { ETLUserProgress, taskLogToDBFormat } from "./ETL";

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
    const { firstchapter, uid, courseid } = decryptData2(dataEncrypted);
    datanotencrypted = {
      data: {
        [`courses.${courseid}`]: {
          completed: [],
          unlocked: [firstchapter],
          lastunlocked: [firstchapter],
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
    const { courseid, chaptersIds, userid, firstchapter } =
      decryptData2(dataEncrypted);

    datanotencrypted = {
      data: {
        [`courses.${courseid}.completed`]: [],
        [`courses.${courseid}.unlocked`]: chaptersIds,
        [`courses.${courseid}.lastunlocked`]: [firstchapter],
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
    const { courseid, chaptersIds, userid, firstchapter } =
      decryptData2(dataEncrypted);

    datanotencrypted = {
      data: {
        [`courses.${courseid}.completed`]: chaptersIds,
        [`courses.${courseid}.unlocked`]: chaptersIds,
        [`courses.${courseid}.lastunlocked`]: [firstchapter],
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
  const value = await checkCoursePaidSA(courseid, uid);
  return value;
};
