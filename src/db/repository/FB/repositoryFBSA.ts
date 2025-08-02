//DB
import { updateDocSA } from "tpconst/DB/FB/SA";

//utils
import { encrypt2 } from "tpconst";
import { throwInnerError } from "tpconst/errorHandlers";
import { UserMetaDB } from "tpconst/T";
import { CLT } from "tpconst/const";

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
    throw throwInnerError(error);
  }
};

export const unlockAllChaptersDBSA = async ({
  courseid,
  chaptersIds,
  userid,
  firstchapter,
}: {
  courseid: string;
  chaptersIds: string[];
  userid: string;
  firstchapter: string;
}) => {
  const data = {
    data: {
      [`courses.${courseid}.completed`]: [],
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [firstchapter],
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
  firstchapter,
}: {
  courseid: string;
  chaptersIds: string[];
  userid: string;
  firstchapter: string;
}) => {
  const data = {
    data: {
      [`courses.${courseid}.completed`]: chaptersIds,
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [firstchapter],
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
