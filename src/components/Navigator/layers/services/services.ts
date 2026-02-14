import { toJS } from "mobx";

import { L } from "@/tpconst/src/lang";
import {
  dialogs,
  getUnitSetInterruptedInfo,
} from "@/components/common/dialog/dialogMacro";

//repository(external)
import {
  checkCoursePaid,
  getUserMetaCourseProgress,
} from "@/app/api/apicalls/dataFetch";
import { checkCourseReady } from "@/db/localRepository/repositoryLocalFiles";

import { saveChampUserTaskLog } from "@/tpconst/src/RP/FB";

//services(external)
import { signOut } from "@/auth/services/servicesAuth";
import { getFlow } from "@/components/course/layers/services/services";
import { saveProgress } from "@/components/unitset/layers/services/services";
import { getUnits } from "@/components/unitset/layers/services/services";

//service helpers
import {
  setChampPageState,
  setFlowPageState,
  setAllCoursePageState,
} from "@/components/Navigator/layers/services/servicesHelpers";

//constants
import {
  CHAMP_DEFAULTS,
  COURSE_DEFAULTS,
  UNITSET_DEFAULTS,
} from "@/tpconst/src/typesdefaults";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import unitset from "@/components/unitset/layers/store/unitset";
import splash from "@/components/common/splash/store";
import countdownbutton from "@/components/common/CountdownButton/store";
import user from "@/auth/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
import chapter from "@/components/unitset/layers/store/chapter";
import unit from "@/components/unitset/unitrun/layers/store/unit";
//

import { CHAPTER_DEFAULTS } from "@/tpconst/src/typesdefaults";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  ChampStatePersisted,
  ChapterStatePersisted,
  CourseStatePersisted,
  UnitsetStatePersisted,
} from "@/tpconst/src/T";
import { CourseProgressDB } from "@/tpconst/src/T";
import { PG, ST, TSM } from "@/tpconst/src/const";
import { Page, SuccessType } from "@/tpconst/src/T";
import {
  E_CODES_DIALOG,
  finalErrorHandler,
  throwInnerError,
} from "@/tpconst/src/errorHandlers";

export const openAllCoursePage = () => {
  setAllCoursePageState();
};

export const openCourseFlowPageFromMain = async (courseid: string) => {
  try {
    splash.showProgress(false, "progressdots", 2000);
    const courseReady = checkCourseReady({ courseid });
    if (!courseReady) throw Error(E_CODES_DIALOG.COURSE_IS_DISABLED);

    const coursePaid = await checkCoursePaid({ courseid, uid: user.userid });
    if (!coursePaid) throw Error(E_CODES_DIALOG.COURSE_IS_NOT_PAID);

    await openAndRefreshFlowPage({ courseid, refetchFlow: true });
  } catch (error) {
    finalErrorHandler(error, dialogs, L.ru.msg);
  } finally {
    splash.closeProgress();
  }
};

export const openAndRefreshFlowPage = async ({
  courseid,
  refetchFlow,
}: {
  courseid: string;
  refetchFlow: boolean;
}) => {
  const progress = await getUserMetaCourseProgress({
    courseid,
    uid: user.userid,
  });
  getFlow({ courseid, refetchFlow, progress });
  setFlowPageState({ courseid, progress });
};

export const openLessonStartPage = async ({
  chapterData = CHAPTER_DEFAULTS,
  unitsetData = UNITSET_DEFAULTS,
  champData = CHAMP_DEFAULTS,
  courseData = COURSE_DEFAULTS,
}: {
  unitsetData: UnitsetStatePersisted;
  chapterData: ChapterStatePersisted;
  champData: ChampStatePersisted;
  courseData: CourseStatePersisted;
}) => {
  try {
    const { unitsetmode, unitsetstage } = unitsetData;

    splash.showProgress();

    const { units: tasks, tasksuuids } = await getUnits({
      champData,
      courseData,
      chapterData,
      unitsetData,
      userProgress: user.progress,
    });

    if (unitsetmode == TSM.textbook && !tasks.length)
      throw new Error(E_CODES_DIALOG.TEXTBOOK_BLOCKED);

    unitset.setUnitSetUnits({ units: tasks });
    unit.setCurrUnit(tasks[0]);

    unitset.setUnitSetStateP({
      ...UNITSET_DEFAULTS,
      unitsetmode,
      unitsetstage: unitsetstage,
      //not [] for "exam" only
      randomsaved: tasksuuids,
      currUnitId: 0,
    });

    chapter.setChapterStateP(chapterData);

    navigator.setStateP({ page: PG.lessonStarted as Page });
    splash.closeProgress();
  } catch (error) {
    splash.closeProgress();
    throw finalErrorHandler(error, dialogs, L.ru.msg);
  }
};

export const openUnitSetPage = async () => {
  splash.showProgress(false, "progressdots", 2000);
  navigator.setStateP({ page: PG.testrun });
  splash.closeProgress();
};

export const openCongratPage = async ({
  success,
}: {
  success: SuccessType;
}) => {
  countdownbutton.hideButton();
  navigator.setStateP({ page: PG.congrat });
  unitset.setUnitSetStateP({ ...unitset.state, success });
};

export const closeCongratPage = async () => {
  const { unitsetmode } = unitset.state;
  splash.showProgress();

  if (
    unitsetmode == TSM.addhoc ||
    unitsetmode == TSM.newtopic ||
    unitsetmode == TSM.exam
  )
    try {
      await saveProgress();
      await openAndRefreshFlowPage({
        courseid: course.state.courseid,
        refetchFlow: true,
      });
    } catch (error: unknown) {
      finalErrorHandler(error, dialogs, L.ru.msg);
    }

  if (unitsetmode == TSM.champ) {
    saveChampUserTaskLog({
      tasklog: unitset.state.tasklog,
      champid: champ.champid,
      userid: user.userid,
    });
    openChampPage();
  }
  splash.closeProgress();
};

export const interruptUnitSet = () => {
  const { unitsetmode } = unitset.state;
  if (unitsetmode != TSM.textbook) {
    const { caption = "", text = "" } = getUnitSetInterruptedInfo({
      completed: chapter.state.completed,
      unitsetmode,
    });

    dialogs.okCancel({
      text,
      caption,
      action: () =>
        openCongratPage({
          success: ST.fail,
        }),
    });
  } else {
    openAndRefreshFlowPage({
      courseid: course.state.courseid,
      refetchFlow: false,
    });
  }
};

export const openTutorial = () => {
  tutorial.show();
};

export const openLoginPageSignOut = async (router: AppRouterInstance) => {
  splash.showProgress(false, "progressdots", 0);
  await signOut(router);
};

export const openChampPage = () => {
  setChampPageState();
};
