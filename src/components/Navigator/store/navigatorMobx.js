import { toJS } from "mobx";
//data model
import { signOutUserClient } from "@/db/domain/domain";
import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

//

//ViewModel
import { setFlowNodes } from "@/components/course/store/courseFlowVM";
import { updateChampTaskLog } from "@/components/champ/store/champVM";
import { getUserProgress } from "@/components/Navigator/store/navigatorVM";
import {
  getTextBook,
  finalizePts,
} from "@/components/taskset/store/tasksetTasksVM";
//

//utils and constants
import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { getReadyCourses } from "@/globals/courses";
//TODO:remove ../
import { initials } from "../hooks/initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/taskset/taskrun/store/task";
import taskset from "@/components/taskset/store/taskset";
import progressStore from "../../common/splash/progressdots/store";
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
    alertdialog.showDialog(
      "Курс недоступен",
      "Данный курс пока недоступен",
      1,
      () => {
        progressStore.setCloseProgress();
      }
    );
    return;
  }
  await openAndRefreshFlowPage(courseid);
  progressStore.setCloseProgress();
};

export const openAndRefreshFlowPage = async (courseid) => {
  course.setFlow({});
  const progress = await getUserProgress(courseid);

  const flowFetched = await setFlowNodes({
    courseid,
    progress,
    openLessonStartPage,
    openAndRefreshFlowPage: async () => await openAndRefreshFlowPage(courseid),
  });
  course.setFlow(flowFetched);
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
  if (nodemode == "champ") {
    console.log("champwid", champid);
    setChampTasks({
      champid,
    });
  }
  if (nodemode == "textbook") {
    const tasks = await getTextBook({
      userProgress: user.progress,
      courseid,
    });

    openTextBook({
      tasks,
    });
  }
  if (nodemode == "renewal") {
    setRandomTasksToRepeat({
      chapterid,
      courseid,
      repeat,
      overflow,
      nodemode,
      remainsum,
      level,
      tobeunlocked,
    });
  }
  if (nodemode == "addhoc" || nodemode == "newtopic") {
    await setRegularTasks({
      chapterid,
      courseid,
      repeat,
      overflow,
      remainsum,
      nodemode,
      tobeunlocked,
    });
  }
  progressStore.setCloseProgress();
};

export const openTextBook = async ({ tasks }) => {
  if (tasks.length) {
    taskset.setAllTasks(tasks, 0);
    taskset.updateState({ ...initials.textBook.taskset });
    navigator.updateState({ ...initials.textBook.navigator });
  } else {
    alertdialog.showDialog(
      "В учебнике нет отрытых тем",
      "Темы в учебнике открываются по мере проходжения курса",
      1,
      () => {
        progressStore.setCloseProgress();
      }
    );
  }
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
      await openAndRefreshFlowPage(course.state.courseid);
      progressStore.setCloseProgress();
    } catch (e) {
      console.log(e);
      alertdialog.showDialog(
        "Сохранение данных",
        ' "Что-то пошло не так, повторите попытку...',
        1,
        () => {
          progressStore.setCloseProgress();
        }
      );
    }
  }

  if (nodemode == "champ") {
    updateChampTaskLog({ tasklog, champid: champ.champid });
    openChampPage();
  }
};

export const openCongratPageInterrupted = () => {
  const { nodemode, pts, remainsum } = taskset.state;
  let caption, text;
  if (nodemode == "renewal" || nodemode == "addhoc" || nodemode == "newtopic") {
    caption = "Завершить";
  }

  if (
    (nodemode == "newtopic" || nodemode == "addhoc") &&
    !taskset.state.repeat
  ) {
    text =
      "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n2 монеты за каждую задачу вместо 10 монет";
  }

  if (nodemode == "renewal" && !taskset.state.repeat) {
    text =
      "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n1 монету за каждую задачу вместо 2 монет";
  }

  if (taskset.state.repeat) {
    text = "Завершить прохождение?";
  }

  if (nodemode == "champ") {
    caption = "Завершить чемпионат";
    text = "Завершить участие в чемпионате?";
  }

  alertdialog.showDialog(
    caption,
    text,
    2,
    () => {
      openCongratPage({
        nodemode,
        pts,
        remainsum,
        success: false,
      });
    },
    () => {}
  );
};

export const openTutorial = () => {
  tutorial.show();
};

export const openRecapTasksPage = ({ taskset }) => {
  dialog.showDialog(
    "Повторение",
    "Попробуй еще раз решить ошибочные задачи",
    1,
    () => {}
  );
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
