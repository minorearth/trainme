import { da } from "@/components/common/dialog/dialogMacro";

// utils
import { ObjtoArr } from "@/globals/utils/objectUtils";
import { sortItems } from "@/components/champ/layers/services/utils";
import { generateString } from "@/globals/utils/utilsRandom";

//repository
import { getRandomTasksForChamp } from "@/components/taskset/layers/repository/repository";

import {
  subscribeOnChamp,
  updateUserInChamp,
  getUserChampStatus,
  createNewChamp,
  setChampStarted,
} from "@/components/champ/layers/repository/repository";

//stores
import user from "@/userlayers/store/user";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import navigator from "@/components/Navigator/layers/store/navigator";
import champ from "@/components/champ/layers/store/champ";
import txtField from "@/components/common/customfield/store";

export const createChamp = async () => {
  const tasks = await getRandomTasksForChamp({
    levelStart: champ.range[0],
    levelEnd: champ.range[1],
    taskCount: txtField.state.tasknum.value,
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
      await updateUserInChamp({
        userid: user.userid,
        data: {
          id: user.userid,
          name: txtField.state.nickname.value,
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
        userid: user.userid,
        data: {
          id: user.userid,
          name: txtField.state.nickname.value,
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
  console.log("тутат");
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
