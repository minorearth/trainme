import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "tpconst/lang";

// utils
import { ObjtoArr } from "@/globals/utils/objectUtils";
import { generateString } from "@/globals/utils/utilsRandom";

//service helpers
import { sortItems } from "@/components/champ/layers/services/servicesHelpers";
import { getRandomTasksForChamp } from "@/components/taskset/layers/services/services";

//repository(local)
import {
  subscribeOnChamp,
  updateUserInChamp,
  getUserChampStatus,
  createNewChamp,
  setChampStarted,
} from "@/db/repository/repositoryFBCA";

//stores
import user from "@/auth/store/user";
import navigator from "@/components/Navigator/layers/store/navigator";
import champ from "@/components/champ/layers/store/champ";
import txtField from "@/components/common/customfield/store";
import splash from "@/components/common/splash/store";
import {
  CHAPTER_DEFAULTS,
  COURSE_DEFAULTS,
  TASKSET_DEFAULTS,
} from "tpconst/typesdefaults";
import { ChampDB } from "tpconst/T";
import { CS, PS, TSM } from "tpconst/constants";
import S from "@/globals/settings";
import { E_CODES } from "errorhandlers";
import {
  finalErrorHandler,
  throwInnerError,
} from "@/globals/errorsHandling/errorHandlers";

export const createChamp = async () => {
  try {
    const tasks = await getRandomTasksForChamp({
      levelStart: champ.range[0],
      levelEnd: champ.range[1],
      taskCount: Number(txtField.state.tasknum.value),
      courseid: S.CHAMP_DEFAULT_COURSEID,
    });
    const champid = generateString(7);
    champ.setChampIdP(champid);
    champ.setUsers([]);
    createNewChamp({ tasks, champid });
  } catch (error: unknown) {
    finalErrorHandler(error, dialogs, L.ru.msg);
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
      try {
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
      } catch (error) {
        throw new Error(E_CODES.NO_CHAMP_FOUND_LIKELY);
      }
    }
    if (persstatus == PS.champwip) throw new Error(E_CODES.CHAMP_COMEBACK);
    if (persstatus == PS.champisover) throw new Error(E_CODES.CHAMP_OVER);
  } catch (error: unknown) {
    finalErrorHandler(error, dialogs, L.ru.msg);
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
  try {
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
  } catch (error) {
    throw throwInnerError(error);
  }
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
