import { getRandomTasksForChamp } from "@/components/taskset/layers/repository/repository";
import { ObjtoArr } from "@/globals/utils/objectUtils";

import {
  subscribeOnChamp,
  updateUserInChamp,
  getUserChampStatus,
  createNewChamp,
  setChampStarted,
} from "@/components/champ/layers/repository/repository";

import { sortItems } from "@/components/champ/layers/services/utils";

import { da } from "@/components/common/dialog/dialogMacro";

import { generateString } from "@/globals/utils/utilsRandom";
import user from "@/userlayers/store/user";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import navigator from "@/components/Navigator/layers/store/navigator";
import champ from "@/components/champ/layers/store/champ";

export const createChamp = async () => {
  const tasks = await getRandomTasksForChamp({
    levelStart: champ.range[0],
    levelEnd: champ.range[1],
    taskCount: champ.taskcount,
    courseid: "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
  });
  if (tasks.status == "error") {
    da.info.notenoughttasks(tasks.count);
  } else {
    const champid = generateString(7);
    champ.setChampIdP(champid);
    champ.setUsers([]);
    createNewChamp({ tasks, champid });
  }
};

export const joinChamp = async () => {
  try {
    const persstatus = await getUserChampStatus({
      userid: user.userid,
      champid: champ.champid,
    });
    console.log("persstatus", persstatus, champ.champid);
    if (persstatus == "joined" || persstatus == "undefined") {
      champ.setCapturingChampstart(true);
      if (champ.champid != champ.subscribedChampid) {
        captureUsersJoined({ champid: champ.champid });
        captureChampStart({ champid: champ.champid });
      }
      updateUserInChamp({
        data: {
          id: user.userid,
          name: user.nickname,
          change: 0,
          pts: 0,
          persstatus: "joined",
          avatarid: user.avatarid,
        },
        champid: champ.champid,
      });
    }
    if (persstatus == "champwip") da.info.champblocked();
    if (persstatus == "champisover") da.info.champover();
  } catch (e) {
    da.info.nochamp(e);
  }
};

export const startChamp = async (champid) => {
  window.open(
    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${champid}`,
    "_blank"
  );
  await setChampStarted({ champid });
};

const launchChamp = (champdoc) => {
  if (
    champdoc.status == "started" &&
    champdoc.users[user.userid]?.persstatus == "joined"
  ) {
    countdowncircle.show(() => {
      navigator.actions.openLessonStartPage({
        champid: champ.champid,
        nodemode: "champ",
      });
      updateUserInChamp({
        data: {
          id: user.userid,
          name: user.nickname,
          change: 0,
          pts: 0,
          persstatus: "champwip",
          avatarid: user.avatarid,
        },
        champid: champ.champid,
      });
      champ.setCapturingChampstart(false);
    });
  }
};

export const captureChampStart = async ({ champid }) => {
  await subscribeOnChamp({
    champid,
    action: launchChamp,
  });
};

const setUsersAndsmth = (champdoc) => {
  const usersArr = ObjtoArr(champdoc?.users);
  const champstarted = champdoc?.status == "started" ? true : false;
  const usersSorted = sortItems({
    newusers: usersArr,
    oldusers: champ.users,
    champstarted,
  });
  champ.setUsers(usersSorted);
  champ.setChampStarted(champstarted);
};

export const captureUsersJoined = async ({ champid }) => {
  champ.setSubscribedChampid(champid);
  await subscribeOnChamp({
    champid,
    action: setUsersAndsmth,
  });
};
