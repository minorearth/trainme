//stores
import { courses } from "@/globals/courses";

//DB
import { updateDocSA } from "@/db/SA/firebaseSA";

//repository
import { fetchChapterIds } from "@/components/course/layers/repository/repository";

//utils
import { encrypt2 } from "@/globals/utils/encryption";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import user from "@/userlayers/store/user";
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/layers/store/task";

export const resetCurrentUser = async () => {
  const courseid = course.state.courseid;
  await resetUser({ courseid, uid: user.userid });
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const resetUser = async ({ courseid, uid }) => {
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
  await updateDocSA("usermeta", encrypt2(data));
};

export const unlockAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await fetchChapterIds({ courseid });
  //TODO: (later)remade unlocked(remove llottie chapters)
  const data = {
    data: {
      [`courses.${courseid}.completed`]: [],
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
    },
    id: user.userid,
  };
  await updateDocSA("usermeta", encrypt2(data));
  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const completeAllChaptersCurrentUser = async () => {
  const courseid = course.state.courseid;
  const chaptersIds = await fetchChapterIds({ courseid });
  const data = {
    data: {
      [`courses.${courseid}.completed`]: chaptersIds,
      [`courses.${courseid}.unlocked`]: chaptersIds,
      [`courses.${courseid}.lastunlocked`]: [courses[courseid].firstchapter],
      [`courses.${courseid}.paid`]: chaptersIds,
    },
    id: user.userid,
  };
  await updateDocSA("usermeta", encrypt2(data));

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const setMoneyCurrentUser = async (inValue) => {
  const courseid = course.state.courseid;
  const data = {
    data: { [`courses.${courseid}.rating`]: Number(inValue) },
    id: user.userid,
  };
  await updateDocSA("usermeta", encrypt2(data));

  navigator.actions.openAndRefreshFlowPage({
    courseid,
    refetchFlow: true,
  });
};

export const gotoLastTask = () => {
  task.setCurrTaskP(taskset.allTasks.length - 1);
};

//DO NOT DEELETE
