import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//repository(external)
import {
  checkCoursePaid,
  getUserMetaCourseProgress,
} from "@/repository/repositoryFetch";
import { checkCourseReady } from "@/repository/repositoryLocalFiles";

import { saveChampUserTaskLog } from "@/repository/repositoryFB";

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
} from "@/T/typesdefaults";

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

import { CHAPTER_DEFAULTS } from "@/T/typesdefaults";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  ChampStatePersisted,
  ChapterStatePersisted,
  CourseStatePersisted,
  TasksetStatePersisted,
} from "@/T/typesState";
import { CourseProgressDB } from "@/T/typesDB";
import { PG, ST, TSM } from "@/T/const";
import { Page, SuccessType } from "@/T/typesBasic";
import { throwInnerError } from "@/globals/errorMessages";

export const openAllCoursePage = () => {
  setAllCoursePageState();
};

export const openCourseFlowPageFromMain = async (courseid: string) => {
  splash.showProgress(false, "progressdots", 2000);

  const coursePaid = await checkCoursePaid({ courseid, uid: user.userid });
  const courseReady = checkCourseReady({ courseid });

  if (!coursePaid || !courseReady) {
    da.info.courseblocked();
    return;
  }
  await openAndRefreshFlowPage({ courseid, refetchFlow: true });
  splash.closeProgress();
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

    const { tasks, tasksuuids } = await getTasks({
      champData,
      courseData,
      chapterData,
      tasksetData,
      userProgress: user.progress,
    });

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

    if (tasksetmode == TSM.textbook && !tasks.length) {
      da.info.textbookblocked();
    } else navigator.setStateP({ page: PG.lessonStarted as Page });
  } catch (error) {
    throw throwInnerError(error);
  }
  splash.closeProgress();
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
    } catch (e: unknown) {
      da.info.networkerror(e);
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
    da.info.tasksetinterrupt({
      action: () =>
        openCongratPage({
          success: ST.fail,
        }),
      tasksetmode,
      completed: chapter.state.completed,
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
