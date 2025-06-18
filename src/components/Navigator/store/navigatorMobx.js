import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//data model
import { signOutUserClient } from "@/db/domain/domain";
import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

//ViewModel
import { getFlow } from "@/components/course/store/courseFlowVM";
import { updateChampTaskLog } from "@/components/champ/store/champVM";
import { finalizePts } from "@/components/taskset/store/tasksetTasksVM";
//

//utils and constants
import { encrypt2 } from "@/globals/utils/encryption";
import { getReadyCourses } from "@/globals/courses";
//TODO:remove ../
import { initials } from "../hooks/initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/taskset/taskrun/store/task";
import taskset from "@/components/taskset/store/taskset";
import progressStore from "@/components/common/splash/progressdots/store";
import alertdialog from "@/components/common/dialog/store";
import dialog from "@/components/common/dialog/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import user from "@/store/user";
import tutorial from "@/components/tutorial/store";
import course from "@/components/course/store/course";
import champ from "@/components/champ/store/champ";
//
import {
  setRegularTasks,
  setRandomTasksToRepeat,
  setChampTasks,
  setRecapTasks,
  getTasks,
} from "@/components/taskset/store/tasksetTasksMobx";

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
  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "renewal") {
    try {
      //TODO: После фейла запроса из-за отсуттвия интернета кнока сохранить не нажимается
      progressStore.setShowProgress(true);
      let dataToEncrypt;

      //TODO: move to VM
      const common = {
        lastcompleted: chapterid,
        repeat,
        pts: rating + pts,
        uid: user.userid,
        tasklog: toJS(tasklog),
        courseid: course.state.courseid,
        sum: (user.progress.stat[chapterid]?.sum ?? 0) + pts,
      };

      if (success) {
        dataToEncrypt = {
          completed: [...completed, chapterid],
          unlocked: toJS(tobeunlocked),
          allunlocked: [...unlocked, ...tobeunlocked],
          ...common,
        };
      } else {
        dataToEncrypt = {
          completed,
          unlocked: lastunlocked,
          allunlocked: unlocked,
          ...common,
        };
      }
      const res = await setDataFetch({
        type: "setusermetadata",
        data: encrypt2(dataToEncrypt),
      });
      if (res == "error") {
        throw new Error("Server error");
      }
      await openAndRefreshFlowPage({
        courseid: course.state.courseid,
        refetchFlow: false,
      });
      progressStore.setCloseProgress();
    } catch (e) {
      da.info.networkerror(e);
    }
  }

  if (nodemode == "champ") {
    updateChampTaskLog({ tasklog, champid: champ.champid });
    openChampPage();
  }
};

export const openCongratPageInterrupted = () => {
  const { nodemode, pts, remainsum } = taskset.state;
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
