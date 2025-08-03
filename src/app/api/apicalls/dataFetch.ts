//types

import { SetDF } from "tpconst/const";
import {
  CourseProgressDB,
  CourseStatDB,
  SetDataFetch,
  TasksLogDB,
  UserMetaDB,
} from "tpconst/T";

//api calls
import { setDataFetch, getDataFetch } from "@/app/api/apicalls/apicalls";
import { GetDF } from "tpconst/const";

//utils
import { encrypt2 } from "tpconst/utils";

//eror handling
import { throwInnerError } from "tpconst/errorHandlers";

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
    const userProgress = await getDataFetch<CourseProgressDB>({
      data: { id: uid, courseid },
      type: GetDF.getuserCoursemetadata,
    });
    return userProgress;
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

// Setters//

export const saveProgressDBFull = async ({
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
    // let userData: UserMetaDB;
    const userData = {
      chapterid,
      courseid,
      rating: rating + pts,
      sum: (stat[chapterid]?.sum ?? 0) + pts,
      tasklog,
      completed: [...completedChapters, chapterid],
      unlocked: [...unlocked, ...tobeunlocked],
      lastunlocked: tobeunlocked,
      userid,
    };
    await saveUserMeta(userData, SetDF.setProgressDBFull);
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
    const userData = {
      chapterid,
      courseid,
      rating: rating + pts,
      tasklog,
      sum: (stat[chapterid]?.sum ?? 0) + pts,
      userid,
    };
    await saveUserMeta(userData, SetDF.setProgress);
  } catch (error: unknown) {
    throw throwInnerError(error);
  }
};

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
    await setDataFetch({
      type: SetDF.paychapter,
      data: encrypt2({
        rating: rating - unlockpts,
        lastunlocked: [chapterid],
        paid: [...paidchapers, chapterid],
        courseid,
        userid: uid,
      }),
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

const saveUserMeta = async (dataToEncrypt: Object, type: SetDataFetch) => {
  try {
    await setDataFetch({
      type,
      data: encrypt2(dataToEncrypt),
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};
