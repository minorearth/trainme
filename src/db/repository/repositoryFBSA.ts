//stores
//TODO:remove
import { courses } from "@/globals/coursesDB";

//DB
import { updateDocSA } from "@/db/FB/SA/firebaseSA";

//utils
import { encrypt2 } from "tpconst/";

//stores

import { dialogs } from "@/components/common/dialog/dialogMacro";
import { finalErrorHandler } from "tpconst/errorHandlers";
import { UserMetaDB } from "tpconst/T";
import { CLT } from "tpconst/const";
import { L } from "tpconst/lang";

export const resetUser = async ({
  courseid,
  uid,
  firstchapter,
}: {
  courseid: string;
  uid: string;
  firstchapter: string;
}) => {
  const data = {
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
  try {
    await updateDocSA<UserMetaDB>({
      collectionName: CLT.usermeta,
      dataencrypted: encrypt2(data),
    });
  } catch (error) {
    finalErrorHandler(error, dialogs, L.ru.msg);
  }
};

export const unlockAllChaptersDBSA = async ({
  courseid,
  chaptersIds,
  userid,
}: {
  courseid: string;
  chaptersIds: string[];
  userid: string;
}) => {
  const data = {
    data: {
      [`courses.${courseid}.completed`]: [],
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
    },
    id: userid,
  };
  await updateDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    dataencrypted: encrypt2(data),
  });
};

export const completeAllChaptersDBSA = async ({
  courseid,
  chaptersIds,
  userid,
}: {
  courseid: string;
  chaptersIds: string[];
  userid: string;
}) => {
  const data = {
    data: {
      [`courses.${courseid}.completed`]: chaptersIds,
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
      [`courses.${courseid}.paid`]: chaptersIds,
    },
    id: userid,
  };
  await updateDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    dataencrypted: encrypt2(data),
  });
};

export const setMoneyDBSA = async ({
  courseid,
  inValue,
  userid,
}: {
  courseid: string;
  inValue: string;
  userid: string;
}) => {
  const data = {
    data: { [`courses.${courseid}.rating`]: Number(inValue) },
    id: userid,
  };
  await updateDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    dataencrypted: encrypt2(data),
  });
};
