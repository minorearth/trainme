import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//repository
import { checkCoursePaid } from "@/components/course/layers/repository/repostory";
import { checkCourseReady } from "@/components/courses/layers/repository/repository";
import { updateChampTaskLog } from "@/components/champ/layers/repository/repository";

//services
import { signOutUser } from "@/userlayers/services/authentication";
import { getFlow } from "@/components/course/layers/services/course";
import { saveProgress } from "@/userlayers/services/services";
import {
  getTasks,
  setTasks,
  updateTasksetState,
} from "@/components/taskset/layers/services/services";

//serice utils
import { finalizePts } from "@/components/taskset/layers/services/utils";
import {
  setChampPageState,
  setFlowPageState,
  setAllCoursePageState,
} from "@/components/Navigator/layers/services/utils";

//constants
import { initials } from "@/components/Navigator/layers/store/initialStates";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";
import progressStore from "@/components/common/splash/progressdots/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import user from "@/userlayers/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
//

export const openAllCoursePage = () => {
  setAllCoursePageState();
};

export const openCourseFlowPageFromMain = async (courseid) => {
  progressStore.setShowProgress(true, false, "progressdots", 2000);

  const coursePaid = await checkCoursePaid({ courseid, uid: user.userid });
  const courseReady = checkCourseReady({ courseid });

  if (!coursePaid || !courseReady) {
    da.info.courseblocked();
    return;
  }
  await openAndRefreshFlowPage({ courseid, refetchFlow: true });
  progressStore.setCloseProgress();
};

export const openAndRefreshFlowPage = async ({ courseid, refetchFlow }) => {
  const progress = await user.actions.getUserCourseProgress(
    courseid,
    user.userid
  );
  getFlow({ courseid, refetchFlow, progress });
  setFlowPageState({ courseid, progress });
};

export const openLessonStartPage = async ({
  courseid,
  chapterid,
  champid,
  repeat,
  overflow,
  remainsum,
  nodemode,
  level,
  tobeunlocked,
}) => {
  progressStore.setShowProgress(true);

  const { tasks, tasksuuids } = await getTasks({
    champid,
    userProgress: user.progress,
    courseid,
    level,
    chapterid,
    nodemode,
    randomsaved: taskset.state.randomsaved,
  });

  setTasks({ nodemode, tasks, taskid: 0 });

  updateTasksetState({
    nodemode,
    chapterid,
    repeat,
    overflow,
    remainsum,
    tobeunlocked,
    level,
    tasksuuids,
  });

  if (nodemode == "textbook" && !tasks.length) {
    da.info.textbookblocked();
  } else navigator.updateStateP(initials[nodemode].navigator);

  progressStore.setCloseProgress();
};

export const openLessonRunPage = async () => {
  progressStore.setShowProgress(true, false, "progressdots", 2000);
  navigator.updateStateP({ ...initials.lessonRun.navigator });
};

export const openCongratPage = async ({
  nodemode,
  pts,
  remainsum,
  success,
}) => {
  countdownbutton.hideButton();
  const ptsFinalized = finalizePts({
    nodemode,
    pts,
    remainsum,
  });
  navigator.updateStateP({ page: "congrat" });
  taskset.updateStateP({ pts: ptsFinalized, success });
};

export const closeCongratPage = async (success) => {
  const nodemode = taskset.state.nodemode;
  progressStore.setShowProgress(true);

  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "exam")
    try {
      await saveProgress({ success });
      await openAndRefreshFlowPage({
        courseid: course.state.courseid,
        refetchFlow: true,
      });
    } catch (e) {
      da.info.networkerror(e);
    }

  if (nodemode == "champ") {
    updateChampTaskLog({
      tasklog: taskset.state.tasklog,
      champid: champ.champid,
      userid: user.userid,
    });
    openChampPage();
  }
  progressStore.setCloseProgress();
};

export const interruptTaskSet = () => {
  const { nodemode, pts, remainsum } = taskset.state;
  if (nodemode != "textbook") {
    da.info.tasksetinterrupt({
      action: () =>
        openCongratPage({
          nodemode,
          pts,
          remainsum,
          success: false,
        }),
      nodemode,
      completed: taskset.state.repeat,
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

export const openLoginPageSignOut = async (router) => {
  //TODO: move method from domain
  await signOutUser(router);
};

export const openChampPage = () => {
  setChampPageState();
};
