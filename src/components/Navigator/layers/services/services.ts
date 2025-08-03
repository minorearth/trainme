import { toJS } from "mobx";

import { L } from "tpconst/lang";
import {
  dialogs,
  getTaskSetInterruptedInfo,
} from "@/components/common/dialog/dialogMacro";

//repository(external)
import {
  checkCoursePaid,
  getUserMetaCourseProgress,
} from "@/app/api/apicalls/dataFetch";
import { checkCourseReady } from "@/db/localRepository/repositoryLocalFiles";

import { saveChampUserTaskLog } from "tpconst/RP/FB";

//services(external)
import { signOut } from "@/auth/services/servicesAuth";
import { getFlow } from "@/components/course/layers/services/services";
import { saveProgress } from "@/components/taskset/layers/services/services";
import { getTasks } from "@/components/taskset/layers/services/services";

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
  TASKSET_DEFAULTS,
} from "tpconst/typesdefaults";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";
import splash from "@/components/common/splash/store";
import countdownbutton from "@/components/common/CountdownButton/store";
import user from "@/auth/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
import chapter from "@/components/taskset/layers/store/chapter";
import task from "@/components/taskset/taskrun/layers/store/task";
//

import { CHAPTER_DEFAULTS } from "tpconst/typesdefaults";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  ChampStatePersisted,
  ChapterStatePersisted,
  CourseStatePersisted,
  TasksetStatePersisted,
} from "tpconst/T";
import { CourseProgressDB } from "tpconst/T";
import { PG, ST, TSM } from "tpconst/const";
import { Page, SuccessType } from "tpconst/T";
import {
  E_CODES,
  finalErrorHandler,
  throwInnerError,
} from "tpconst/errorHandlers";

export const openAllCoursePage = () => {
  setAllCoursePageState();
};

export const openCourseFlowPageFromMain = async (courseid: string) => {
  try {
    splash.showProgress(false, "progressdots", 2000);

    const coursePaid = await checkCoursePaid({ courseid, uid: user.userid });
    const courseReady = checkCourseReady({ courseid });

    if (!coursePaid || !courseReady) throw Error(E_CODES.COURSE_IS_DISABLED);

    await openAndRefreshFlowPage({ courseid, refetchFlow: true });
    splash.closeProgress();
  } catch (error) {
    finalErrorHandler(error, dialogs, L.ru.msg);
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
  tasksetData = TASKSET_DEFAULTS,
  champData = CHAMP_DEFAULTS,
  courseData = COURSE_DEFAULTS,
}: {
  tasksetData: TasksetStatePersisted;
  chapterData: ChapterStatePersisted;
  champData: ChampStatePersisted;
  courseData: CourseStatePersisted;
}) => {
  try {
    const { tasksetmode, taskstage } = tasksetData;

    splash.showProgress();

    console.log(
      "tasks",
      champData,
      courseData,
      chapterData,
      tasksetData,
      toJS(user.progress)
    );

    const { tasks, tasksuuids } = await getTasks({
      champData,
      courseData,
      chapterData,
      tasksetData,
      userProgress: user.progress,
    });

    if (tasksetmode == TSM.textbook && !tasks.length)
      throw new Error(E_CODES.TEXTBOOK_BLOCKED);

    taskset.setTaskSetTasks({ tasks });
    task.setCurrTask(tasks[0]);

    taskset.setTaskSetStateP({
      ...TASKSET_DEFAULTS,
      tasksetmode,
      taskstage,
      //not [] for "exam" only
      randomsaved: tasksuuids,
      currTaskId: 0,
    });

    chapter.setChapterStateP(chapterData);

    navigator.setStateP({ page: PG.lessonStarted as Page });
    splash.closeProgress();
  } catch (error) {
    splash.closeProgress();

    throw finalErrorHandler(error, dialogs, L.ru.msg);
  }
};

export const openTaskSetPage = async () => {
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
  taskset.setTaskSetStateP({ ...taskset.state, success });
};

export const closeCongratPage = async () => {
  const { tasksetmode } = taskset.state;
  splash.showProgress();

  if (
    tasksetmode == TSM.addhoc ||
    tasksetmode == TSM.newtopic ||
    tasksetmode == TSM.exam
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

  if (tasksetmode == TSM.champ) {
    saveChampUserTaskLog({
      tasklog: taskset.state.tasklog,
      champid: champ.champid,
      userid: user.userid,
    });
    openChampPage();
  }
  splash.closeProgress();
};

export const interruptTaskSet = () => {
  const { tasksetmode } = taskset.state;
  if (tasksetmode != TSM.textbook) {
    const { caption = "", text = "" } = getTaskSetInterruptedInfo({
      completed: chapter.state.completed,
      tasksetmode,
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
