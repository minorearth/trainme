//stores
import { courses } from "@/globals/coursesDB";

//DB
import { updateDocSA } from "@/db/SA/firebaseSA";

//repository
import { getChapterIds_admin } from "@/repository/repositoryFB";

//utils
import { encrypt2 } from "@/globals/utils/encryption";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import user from "@/auth/store/user";
import { CLT, UserMetaDB } from "@/T/typesDB";

import E, { finalErrorHandler } from "@/globals/errorMessages";

export const resetCurrentUser = async () => {
  const courseid = course.state.courseid;
  await resetUser({ courseid, uid: user.userid });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const resetUser = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  const data = {
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
  try {
    await updateDocSA<UserMetaDB>({
      collectionName: CLT.usermeta,
      dataencrypted: encrypt2(data),
    });
  } catch (error) {
    finalErrorHandler(error);
  }
};

export const unlockAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await getChapterIds_admin({ courseid });
  const data = {
    data: {
      [`courses.${courseid}.completed`]: [],
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
    },
    id: user.userid,
  };
  await updateDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    dataencrypted: encrypt2(data),
  });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const completeAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await getChapterIds_admin({ courseid });
  const data = {
    data: {
      [`courses.${courseid}.completed`]: chaptersIds,
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
      [`courses.${courseid}.paid`]: chaptersIds,
    },
    id: user.userid,
  };
  await updateDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    dataencrypted: encrypt2(data),
  });

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const setMoneyCurrentUser = async (inValue: string) => {
  const courseid = course.state.courseid;
  const data = {
    data: { [`courses.${courseid}.rating`]: Number(inValue) },
    id: user.userid,
  };
  await updateDocSA<UserMetaDB>({
    collectionName: CLT.usermeta,
    dataencrypted: encrypt2(data),
  });

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

//DO NOT DEELETE
