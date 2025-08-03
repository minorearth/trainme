"use client";
//repository
import { getChapterIds_admin } from "tpconst/RP/FB";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import user from "@/auth/store/user";
import { courses } from "@/globals/coursesDB";

import { encrypt2 } from "tpconst/utils";
import {
  resetUser,
  completeAllChaptersDBSA,
  setMoneyDBSA,
  unlockAllChaptersDBSA,
} from "@/app/serverActons";

export async function resetCurrentUser() {
  const courseid = course.state.courseid;
  console.log(
    "reser user",
    resetUser,
    courses[courseid].firstchapter,
    user.userid
  );
  await resetUser(
    encrypt2({
      courseid,
      uid: user.userid,
      firstchapter: courses[courseid].firstchapter,
    })
  );

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
}

export const unlockAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await getChapterIds_admin({ courseid });

  await unlockAllChaptersDBSA(
    encrypt2({
      courseid,
      userid: user.userid,
      chaptersIds,
      firstchapter: courses[courseid].firstchapter,
    })
  );

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const completeAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await getChapterIds_admin({ courseid });
  await completeAllChaptersDBSA(
    encrypt2({
      courseid,
      userid: user.userid,
      chaptersIds,
      firstchapter: courses[courseid].firstchapter,
    })
  );

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const setMoneyCurrentUser = async (inValue: string) => {
  const courseid = course.state.courseid;
  await setMoneyDBSA(encrypt2({ courseid, userid: user.userid, inValue }));
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

//DO NOT DEELETE
