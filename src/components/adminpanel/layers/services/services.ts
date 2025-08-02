//repository
import { getChapterIds_admin } from "@/db/repository/FB/repositoryFBCA";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import user from "@/auth/store/user";
import { courses } from "@/globals/coursesDB";
import {
  completeAllChaptersDBSA,
  resetUser,
  setMoneyDBSA,
  unlockAllChaptersDBSA,
} from "@/db/repository/FB/repositoryFBSA";

export const resetCurrentUser = async () => {
  const courseid = course.state.courseid;
  await resetUser({
    courseid,
    uid: user.userid,
    firstchapter: courses[courseid].firstchapter,
  });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const unlockAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await getChapterIds_admin({ courseid });

  await unlockAllChaptersDBSA({
    courseid,
    userid: user.userid,
    chaptersIds,
    firstchapter: courses[courseid].firstchapter,
  });

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const completeAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await getChapterIds_admin({ courseid });
  await completeAllChaptersDBSA({
    courseid,
    userid: user.userid,
    chaptersIds,
    firstchapter: courses[courseid].firstchapter,
  });

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const setMoneyCurrentUser = async (inValue: string) => {
  const courseid = course.state.courseid;
  await setMoneyDBSA({ courseid, userid: user.userid, inValue });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

//DO NOT DEELETE
