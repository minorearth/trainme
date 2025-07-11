import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//repository(external)
import {
  checkCourseReady,
  checkCoursePaid,
} from "@/components/courses/layers/repository/repository";
import { saveChampUserTaskLog } from "@/components/champ/layers/repository/repository";
import { getUserMetaCourseProgress } from "@/userlayers/repository/repositoryUserMeta";

//services(external)
import { signOut } from "@/userlayers/services/servicesAuth";
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
import { initials } from "@/components/Navigator/layers/store/initialStates";
import { TASKSET_DEFAULTS } from "@/typesdefaults";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";
import splash from "@/components/common/splash/store";
import countdownbutton from "@/components/common/CountdownButton/store";
import user from "@/userlayers/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
import chapter from "@/components/taskset/layers/store/chapter";
//

import {
  TasksetState,
  UserProgress,
  ChapterState,
  ChampState,
  CourseState,
  Page,
} from "@/types";

import { CHAPTER_DEFAULTS } from "@/typesdefaults";

import { NextRouter } from "next/router";

export const openAllCoursePage = () => {
  setAllCoursePageState();
};

export const openCourseFlowPageFromMain = async (courseid: string) => {
  splash.setShowProgress(false, "progressdots", 2000);

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
  const progress = await getUserMetaCourseProgress(courseid, user.userid);
  getFlow({ courseid, refetchFlow, progress });
  setFlowPageState({ courseid, progress });
};

export const openLessonStartPage = async ({
  chapterData = CHAPTER_DEFAULTS,
  tasksetData,
  champData = { champid: "" },
  courseData = {},
}: {
  tasksetData: TasksetState;
  chapterData: ChapterState;
  champData: ChampState;
  courseData: CourseState;
}) => {
  const { tasksetmode, taskstage } = tasksetData;

  splash.setShowProgress();

  const { tasks, tasksuuids } = await getTasks({
    champData,
    courseData,
    chapterData,
    tasksetData,
    userProgress: user.progress as UserProgress,
  });

  taskset.setTasks(tasks, 0);

  taskset.setStateP({
    ...TASKSET_DEFAULTS,
    tasksetmode,
    taskstage,
    //not [] for "exam" only
    randomsaved: tasksuuids,
  });

  chapter.setChapterP(chapterData);

  if (tasksetmode == "textbook" && !tasks.length) {
    da.info.textbookblocked();
  } else
    navigator.setStateP({ page: initials[tasksetmode].navigator.page as Page });

  splash.closeProgress();
};

export const openTaskSetPage = async () => {
  splash.setShowProgress(false, "progressdots", 2000);
  navigator.setStateP({ page: initials.tasksetpage.navigator.page as Page });
  splash.closeProgress();
};

export const openCongratPage = async ({ success }: { success: boolean }) => {
  countdownbutton.hideButton();
  navigator.setStateP({ page: "congrat" });
  taskset.setStateP({ ...taskset.state, success });
};

export const closeCongratPage = async (success: boolean) => {
  const tasksetmode = taskset.state.tasksetmode;
  splash.setShowProgress();

  if (
    tasksetmode == "addhoc" ||
    tasksetmode == "newtopic" ||
    tasksetmode == "exam"
  )
    try {
      await saveProgress({ success });
      await openAndRefreshFlowPage({
        courseid: course.state.courseid,
        refetchFlow: true,
      });
    } catch (e) {
      da.info.networkerror(e);
    }

  if (tasksetmode == "champ") {
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
  if (tasksetmode != "textbook") {
    da.info.tasksetinterrupt({
      action: () =>
        openCongratPage({
          success: false,
        }),
      tasksetmode,
      completed: chapter.chapter.completed,
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

export const openLoginPageSignOut = async (router: NextRouter) => {
  await signOut(router);
};

export const openChampPage = () => {
  setChampPageState();
};
