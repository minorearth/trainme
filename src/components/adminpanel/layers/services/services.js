import { courses } from "@/globals/courses";

import {
  resetUserMetaData_admin,
  unlockAllCourseChapters_admin,
  unlockAndCompleteAllCourseChapters_admin,
  setMoney_admin,
} from "@/db/SA/firebaseSA";

import { fetchChapterIds } from "@/components/course/layers/repository/repostory";

import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import user from "@/userlayers/store/user";
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/layers/store/task";

export const resetCurrentUser = async () => {
  const courseid = course.state.courseid;
  await resetUserMetaData_admin({
    lastunlocked: courses[courseid].firstchapter,
    courseid,
    uid: user.userid,
  });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const unlockAllChapters = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await fetchChapterIds({ courseid });
  await unlockAllCourseChapters_admin({
    //TODO: remade unlocked
    unlocked: chaptersIds,
    lastunlocked: courses[courseid].firstchapter,
    courseid,
    uid: user.userid,
  });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const completeAllChapters = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await fetchChapterIds({ courseid });
  await unlockAndCompleteAllCourseChapters_admin({
    unlocked: chaptersIds,
    lastunlocked: courses[courseid].firstchapter,
    courseid,
    uid: user.userid,
  });

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const setMoney = async (inValue) => {
  const courseid = course.state.courseid;
  await setMoney_admin({ courseid, uid: user.userid, money: inValue });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const gotoLastTask = () => {
  task.setCurrTaskP(taskset.allTasks.length - 1);
};

//DO NOT DEELETE
// resetUserMetaData_admin(
//   courses["6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"].firstchapter,
//   "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
//   user.userid
// );
