//types

import { SetDF } from "tpconst/const";
import {
  CourseProgressDB,
  CourseStatDB,
  TasksLogDB,
  UserMetaDB,
} from "tpconst/T";

//api calls
import { setDataFetch, getDataFetch } from "@/apicalls/apicalls";
import { GetDF } from "tpconst/const";

//utils
import { encrypt2 } from "tpconst/utils";

//ETL
import { ETLUserProgress } from "@/db/repository/ETL/ETLUserMeta";

//eror handling
import { taskLogToDBFormat } from "./ETL/ETLTaskset";
import { throwInnerError } from "tpconst/errorHandlers";

//course
export const buyChapterCall = async ({
  rating,
  paidchapers,
  courseid,
  unlockpts,
  chapterid,
  uid,
}: {
  rating: number;
  paidchapers: string[];
  courseid: string;
  unlockpts: number;
  chapterid: string;
  uid: string;
}) => {
  try {
    console.log();
    await setDataFetch({
      type: SetDF.paychapter,
      body: encrypt2({
        data: {
          [`courses.${courseid}.rating`]: rating - unlockpts,
          [`courses.${courseid}.lastunlocked`]: [chapterid],
          [`courses.${courseid}.paid`]: [...paidchapers, chapterid],
        },
        id: uid,
      }),
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

//courses
export const checkCoursePaid = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  try {
    const coursePaid = await getDataFetch<boolean>({
      type: GetDF.checkcoursepaid,
      data: { courseid, id: uid },
    });
    return coursePaid;
  } catch (error) {
    throw throwInnerError(error);
  }
};

//usermeta
export const getUserMetaCourseProgress = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  try {
    const allUserMeta = await getDataFetch<UserMetaDB>({
      data: { id: uid },
      type: GetDF.getusermetadata,
    });
    //TODO:(later)keep only keys needed
    const userProgress: CourseProgressDB = ETLUserProgress(
      allUserMeta.courses[courseid]
    );
    return userProgress;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const saveUserMeta = async (dataToEncrypt: {
  data: UserMetaDB;
  id: string;
}) => {
  try {
    await setDataFetch({
      type: SetDF.setusermetadata,
      body: encrypt2(dataToEncrypt),
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getUserMeta = async (uid: string) => {
  try {
    const userMeta = await getDataFetch<UserMetaDB>({
      data: { id: uid },
      type: GetDF.getusermetadata,
    });
    return userMeta;
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const saveProgressDBNotCompletedAndSuccess = async ({
  courseid,
  chapterid,
  tasklog,
  rating,
  pts,
  stat,
  completedChapters,
  unlocked,
  tobeunlocked,
  userid,
}: {
  courseid: string;
  chapterid: string;
  tasklog: TasksLogDB;
  rating: number;
  pts: number;
  stat: CourseStatDB;
  completedChapters: string[];
  unlocked: string[];
  tobeunlocked: string[];
  userid: string;
}) => {
  try {
    const tasklogPrepared = taskLogToDBFormat({
      courseid,
      lastcompleted: chapterid,
      tasklog,
    });
    let userData: UserMetaDB;
    userData = {
      [`courses.${courseid}.rating`]: rating + pts,
      [`courses.${courseid}.stat.${chapterid}.sum`]:
        (stat[chapterid]?.sum ?? 0) + pts,
      ...tasklogPrepared,
    };
    userData = {
      ...userData,
      [`courses.${courseid}.completed`]: [...completedChapters, chapterid],
      //all unlocked chapters(more than completed by lastunlocked)
      [`courses.${courseid}.unlocked`]: [...unlocked, ...tobeunlocked],
      //next chapters after just completed
      [`courses.${courseid}.lastunlocked`]: tobeunlocked,
    };

    await saveUserMeta({ data: userData, id: userid });
  } catch (error: unknown) {
    throw throwInnerError(error);
  }
};

export const saveProgressDB = async ({
  courseid,
  chapterid,
  tasklog,
  rating,
  pts,
  stat,
  userid,
}: {
  courseid: string;
  chapterid: string;
  tasklog: TasksLogDB;
  rating: number;
  pts: number;
  stat: CourseStatDB;
  userid: string;
}) => {
  try {
    const tasklogPrepared = taskLogToDBFormat({
      courseid,
      lastcompleted: chapterid,
      tasklog,
    });
    //TODO: (not captured)После фейла запроса из-за отсутвия интернета кнопка сохранить не нажимается(later)
    let userData: UserMetaDB;
    userData = {
      [`courses.${courseid}.rating`]: rating + pts,
      [`courses.${courseid}.stat.${chapterid}.sum`]:
        (stat[chapterid]?.sum ?? 0) + pts,
      ...tasklogPrepared,
    };

    await saveUserMeta({ data: userData, id: userid });
  } catch (error) {
    throw throwInnerError(error);
  }
};
