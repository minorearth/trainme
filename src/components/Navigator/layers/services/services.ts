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
import user from "@/userlayers/store/user";
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
  Page,
  SuccessType,
  TasksetStatePersisted,
} from "@/T/typesState";
import { CourseProgressDB } from "@/T/typesDB";

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

  if (tasksetmode == "textbook" && !tasks.length) {
    da.info.textbookblocked();
  } else navigator.setStateP({ page: "lessonStarted" as Page });

  splash.closeProgress();
};

export const openTaskSetPage = async () => {
  splash.showProgress(false, "progressdots", 2000);
  navigator.setStateP({ page: "testrun" });
  splash.closeProgress();
};

export const openCongratPage = async ({
  success,
}: {
  success: SuccessType;
}) => {
  countdownbutton.hideButton();
  navigator.setStateP({ page: "congrat" });
  taskset.setTaskSetStateP({ ...taskset.state, success });
};

export const closeCongratPage = async () => {
  const { tasksetmode } = taskset.state;
  splash.showProgress();

  if (
    tasksetmode == "addhoc" ||
    tasksetmode == "newtopic" ||
    tasksetmode == "exam"
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
          success: "fail",
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
