import { da } from "@/components/common/dialog/dialogMacro";

// utils
import { ObjtoArr } from "@/globals/utils/objectUtils";
import { generateString } from "@/globals/utils/utilsRandom";

//service helpers
import { sortItems } from "@/components/champ/layers/services/servicesHelpers";

//repository(external)
import { getRandomTasksForChamp } from "@/components/taskset/layers/services/services";

//repository(local)
import {
  subscribeOnChamp,
  updateUserInChamp,
  getUserChampStatus,
  createNewChamp,
  setChampStarted,
} from "@/components/champ/layers/repository/repository";

//stores
import user from "@/userlayers/store/user";
import navigator from "@/components/Navigator/layers/store/navigator";
import champ from "@/components/champ/layers/store/champ";
import txtField from "@/components/common/customfield/store";
import splash from "@/components/common/splash/store";
import { CHAPTER_DEFAULTS, TASKSET_DEFAULTS } from "@/typesdefaults";
import { TasksetMode } from "@/types";

export const createChamp = async () => {
  const tasks = await getRandomTasksForChamp({
    levelStart: champ.range[0],
    levelEnd: champ.range[1],
    taskCount: Number(txtField.state.tasknum.value),
    courseid: "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
  });
  if (tasks.status == "error") {
    da.info.notenoughttasks(tasks.count);
  } else {
    const champid = generateString(7);
    champ.setChampIdP(champid);
    champ.setUsers([]);
    createNewChamp({ tasks: tasks.tasks, champid });
  }
};

export const joinChamp = async () => {
  try {
    const persstatus = await getUserChampStatus({
      userid: user.userid,
      champid: champ.champid,
    });
    if (persstatus == "joined" || persstatus == "undefined") {
      champ.setCapturingChampstart(true);
      if (champ.champid != champ.subscribedChampid) {
        captureUsersJoined({ champid: champ.champid });
        captureChampStart({ champid: champ.champid });
      }
      await updateUserInChamp({
        userid: user.userid,
        champuserdata: {
          uid: user.userid,
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

export const startChamp = async (champid: string) => {
  window.open(
    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${champid}`,
    "_blank"
  );
  await setChampStarted({ champid });
};

const captureAndlaunchChamp = (champdoc: any) => {
  if (
    champdoc.status == "started" &&
    champdoc.users[user.userid]?.persstatus == "joined"
  ) {
    splash.showCountDown(false, () => launchChamp());
  }
};

const launchChamp = () => {
  navigator.actions.openLessonStartPage({
    champData: { champid: champ.champid },
    tasksetData: { ...TASKSET_DEFAULTS, tasksetmode: "champ" as TasksetMode },
    courseData: {},
    chapterData: CHAPTER_DEFAULTS,
  });
  updateUserInChamp({
    userid: user.userid,
    champuserdata: {
      uid: user.userid,
      name: txtField.state.nickname.value,
      change: 0,
      pts: 0,
      persstatus: "champwip",
      avatarid: user.avatarid,
    },
    champid: champ.champid,
  });
  champ.setCapturingChampstart(false);
};

export const captureChampStart = async ({ champid }: { champid: string }) => {
  await subscribeOnChamp({
    champid,
    action: captureAndlaunchChamp,
  });
};

const setUsersAndsmth = (champdoc: any) => {
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

export const captureUsersJoined = async ({ champid }: { champid: string }) => {
  champ.setSubscribedChampid(champid);
  await subscribeOnChamp({
    champid,
    action: setUsersAndsmth,
  });
};
