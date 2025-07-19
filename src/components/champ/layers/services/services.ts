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
import {
  CHAPTER_DEFAULTS,
  COURSE_DEFAULTS,
  TASKSET_DEFAULTS,
} from "@/T/typesdefaults";
import { ChampDB } from "@/T/typesDB";
import { CS, PS, TSM } from "@/T/typesBasic";
import S from "@/globals/settings";

export const createChamp = async () => {
  const tasks = await getRandomTasksForChamp({
    levelStart: champ.range[0],
    levelEnd: champ.range[1],
    taskCount: Number(txtField.state.tasknum.value),
    courseid: S.CHAMP_DEFAULT_COURSEID,
  });
  //TODO: throw error
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
    if (persstatus == PS.joined || persstatus == PS.undefined) {
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
          persstatus: PS.joined,
          avatarid: user.avatarid,
        },
        champid: champ.champid,
      });
    }
    if (persstatus == PS.champwip) da.info.champblocked();
    if (persstatus == PS.champisover) da.info.champover();
  } catch (e: unknown) {
    da.info.nochamp(e);
  }
};

export const startChamp = async (champid: string) => {
  window.open(
    `${process.env.NEXT_PUBLIC_DOMAIN}/${S.P.DASHBOARD}/${champid}`,
    "_blank"
  );
  await setChampStarted({ champid });
};

const captureAndlaunchChamp = (champdoc: ChampDB) => {
  if (
    champdoc.status == CS.started &&
    champdoc.users[user.userid]?.persstatus == PS.joined
  ) {
    splash.showCountDown(false, () => launchChamp());
  }
};

const launchChamp = () => {
  navigator.actions.openLessonStartPage({
    champData: { champid: champ.champid },
    tasksetData: { ...TASKSET_DEFAULTS, tasksetmode: TSM.champ },
    courseData: COURSE_DEFAULTS,
    chapterData: CHAPTER_DEFAULTS,
  });
  updateUserInChamp({
    userid: user.userid,
    champuserdata: {
      uid: user.userid,
      name: txtField.state.nickname.value,
      change: 0,
      pts: 0,
      persstatus: PS.champwip,
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

const setUsersAndsmth = (champData: ChampDB) => {
  const usersArr = ObjtoArr(champData?.users);
  const champstarted = champData?.status == CS.started ? true : false;
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
