import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//data model
import { signOutUserClient } from "@/db/domain/domain";
import { getDataFetch } from "@/db/APIcalls/calls";

//ViewModel
import { getFlow, saveProgress } from "@/components/course/store/courseFlowVM";
import { updateChampTaskLog } from "@/components/champ/store/champVM";
import { finalizePts } from "@/components/taskset/store/tasksetUtilsMobx";
//

import {
  setRegularTasks,
  setRandomTasksToRepeat,
  setChampTasks,
  setRecapTasks,
  getTasks,
} from "@/components/taskset/store/tasksetTasksMobx";

//utils and constants
import { getReadyCourses } from "@/globals/courses";
import { initials } from "@/components/Navigator/hooks/initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/taskset/taskrun/store/task";
import taskset from "@/components/taskset/store/taskset";
import progressStore from "@/components/common/splash/progressdots/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import user from "@/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/store/course";
import champ from "@/components/champ/store/champ";
//

export const openAllCoursePage = () => {
  navigator.setState({ ...initials.courses.navigator });
  course.eraseState();
  champ.eraseState();
  taskset.eraseState();
  task.eraseState();
};

export const openCourseFlowPageFromMain = async (courseid) => {
  progressStore.setShowProgress(true, false, "progressdots", 2000);
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, uid: user.userid },
  });

  if (!coursePaid || !getReadyCourses().includes(courseid)) {
    da.info.courseblocked();
    return;
  }
  await openAndRefreshFlowPage({ courseid, refetchFlow: true });
  progressStore.setCloseProgress();
};

export const openAndRefreshFlowPage = async ({ courseid, refetchFlow }) => {
  const { flow, progress } = await getFlow({ courseid, refetchFlow });
  course.setFlow(flow);
  course.updateState({ courseid });
  navigator.updateState({ page: "flow" });
  taskset.eraseState();
  task.eraseState();
  user.setProgress(progress);
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
  });

  const common = {
    chapterid,
    repeat,
    overflow,
    nodemode,
    remainsum,
    tobeunlocked,
    tasks,
  };

  if (nodemode == "champ") setChampTasks({ tasks });
  if (nodemode == "textbook") openTextBook({ tasks });
  if (nodemode == "addhoc" || nodemode == "newtopic")
    setRegularTasks({ ...common });
  if (nodemode == "renewal") {
    setRandomTasksToRepeat({
      ...common,
      level,
      tasksuuids,
    });
  }

  progressStore.setCloseProgress();
};

export const openTextBook = async ({ tasks }) => {
  if (tasks.length) {
    taskset.setAllTasks(tasks, 0);
    taskset.updateState({ ...initials.textBook.taskset });
    navigator.updateState({ ...initials.textBook.navigator });
  } else da.info.textbookblocked();
};

export const openLessonRunPage = async () => {
  progressStore.setShowProgress(true, false, "progressdots", 2000);
  navigator.updateState({ ...initials.lessonRun.navigator });
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
  navigator.updateState({ page: "congrat" });
  taskset.updateState({ pts: ptsFinalized, success });
};

export const closeCongratPage = async (success) => {
  const { chapterid, tobeunlocked, pts, tasklog, repeat, nodemode } =
    taskset.state;
  const { unlocked, completed, rating, lastunlocked } = user.progress;
  progressStore.setShowProgress(true);

  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "renewal")
    try {
      await saveProgress({
        courseid: course.state.courseid,
        chapterid,
        unlocked,
        completed,
        rating,
        lastunlocked,
        tobeunlocked,
        pts,
        repeat,
        sum: user.progress.stat[chapterid]?.sum ?? 0,
        success,
        uid: user.userid,
        tasklog,
      });
      await openAndRefreshFlowPage({
        courseid: course.state.courseid,
        refetchFlow: false,
      });
    } catch (e) {
      da.info.networkerror(e);
    }

  if (nodemode == "champ") {
    updateChampTaskLog({ tasklog, champid: champ.champid });
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

export const openRecapTasksPage = ({ taskset }) => {
  da.info.recap();
  setRecapTasks(taskset);
};

export const openLoginPageSignOut = async () => {
  await signOutUserClient();
};

// const openSupportPage = () => {
//   window.open("http://t.me/delta1298", "_blank");
// };

export const openChampPage = () => {
  course.eraseState();
  taskset.eraseState();
  task.eraseState();
  navigator.setState({ ...initials.champ.navigator });
};
