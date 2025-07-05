import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//repository
import { checkCoursePaid } from "@/components/course/layers/repository/repostory";
import { checkCourseReady } from "@/components/courses/layers/repository/repository";
import { updateChampTaskLog } from "@/components/champ/layers/repository/repository";

//services
import { signOutUser } from "@/userlayers/services/servicesAuth";
import { getFlow } from "@/components/course/layers/services/course";
import { saveProgress } from "@/userlayers/services/services";
import {
  getTasks,
  setTasks,
  updateTasksetState,
} from "@/components/taskset/layers/services/services";

//service helpers
import {
  setChampPageState,
  setFlowPageState,
  setAllCoursePageState,
} from "@/components/Navigator/layers/services/servicesHelpers";

//constants
import { initials } from "@/components/Navigator/layers/store/initialStates";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";
import splash from "@/components/common/splash/store";
import countdownbutton from "@/components/common/CountdownButton/store";
import user from "@/userlayers/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
//

export const openAllCoursePage = () => {
  setAllCoursePageState();
};

export const openCourseFlowPageFromMain = async (courseid) => {
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
  completed,
  overflow,
  remainsum,
  nodemode,
  level,
  tobeunlocked,
}) => {
  splash.setShowProgress();

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
    completed,
    overflow,
    remainsum,
    tobeunlocked,
    level,
    tasksuuids,
  });

  if (nodemode == "textbook" && !tasks.length) {
    da.info.textbookblocked();
  } else navigator.updateStateP(initials[nodemode].navigator);

  splash.closeProgress();
};

export const openTaskSetPage = async () => {
  splash.setShowProgress(false, "progressdots", 2000);
  navigator.updateStateP({ ...initials.tasksetpage.navigator });
  splash.closeProgress();
};

export const openCongratPage = async ({ success }) => {
  countdownbutton.hideButton();
  navigator.updateStateP({ page: "congrat" });
  taskset.updateStateP({ success });
};

export const closeCongratPage = async (success) => {
  const nodemode = taskset.state.nodemode;
  splash.setShowProgress();

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
  splash.closeProgress();
};

export const interruptTaskSet = () => {
  const { nodemode, pts, remainsum } = taskset.state;
  if (nodemode != "textbook") {
    da.info.tasksetinterrupt({
      action: () =>
        openCongratPage({
          success: false,
        }),
      nodemode,
      completed: taskset.state.completed,
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
