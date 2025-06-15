import { toJS } from "mobx";
//react stuff
import { useEffect, useState } from "react";

//data model
import { setCSP, getCSP, updateSCP } from "@/db/localstorage";
import { signOutUserClient } from "@/db/domain/domain";
import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

//

//ViewModel
import { setFlowNodes } from "@/components/Navigator/hooks/courseFlowVM";
import {
  updateChampPoints,
  updateChampTaskLog,
  getUserProgress,
} from "@/components/Navigator/hooks/navigatorVM";
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getTextBook,
  getRandomTasksForRepeat,
  getRandomTasksForChamp,
  getChampTasks,
} from "@/components/Navigator/hooks/chapterTasksVM";
//

//utils and constants
import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { getReadyCourses } from "@/globals/courses";
import { initials } from "./initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import progressStore from "../../common/splash/progressdots/store";
import alertdialog from "@/components/common/dialog/store";
import dialog from "@/components/common/dialog/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import user from "@/store/user";
import tutorial from "@/components/tutorial/store";
//

//Initial Load
export const loadPTrek = async () => {
  //TODO:load username
  const CSP = getCSP();
  if (!CSP) {
    nav.setAppState(initials.initialState.navigator);
  } else {
    CSP.navigator && nav.setAppState(CSP.navigator);
    CSP.chapter && chapter.updateState(CSP.chapter);
    CSP.task && task.setCurrTask(CSP.task.currTaskId);
    CSP.user && user.setProgress(CSP.user.progress);
  }
  const page = CSP?.navigator?.page || "courses";
  if (page == "flow") {
    const coursePaid = await getDataFetch({
      type: "checkcoursepaid",
      data: { courseid: CSP.chapter.courseid, uid: user.userid },
    });
    if (coursePaid) {
      await openAndRefreshFlowPage(CSP.chapter.courseid);
    } else {
      openAllCoursePage();
    }
  }
  if (page == "testrun" || page == "lessonStarted") {
    recoverLessonInProgress({ CSP });
  }
  if (page == "congrat") {
    //TODO: wtf
  }

  if (!page || page == "courses" || page == "champ") {
    nav.setAppState(initials.initialState.navigator);
  }
  // setLoading(false);
  progressStore.setCloseProgress();
};

const recoverLessonInProgress = async ({ CSP }) => {
  let tasks;
  const { nodemode, pts, remainsum, taskstage } = chapter.state;

  // //for recover purposes
  console.log("здеся");
  navigator.updateAppState({ page: "testrun" });
  // //

  if (nodemode == "renewal") {
    const { tasksFetched } = await getRandomTasksForRepeat({
      courseid: CSP.chapter.courseid,
      levelStart: CSP.chapter.level - 5,
      levelEnd: CSP.chapter.level,
      randomsaved: CSP.chapter.randomsaved,
    });
    tasks = tasksFetched;
  }
  if (nodemode == "addhoc" || nodemode == "newtopic") {
    tasks = await getAllTasksFromChapter(
      CSP.chapter.chapterid,
      CSP.chapter.courseid
    );
  }

  if (nodemode == "champ") {
    const champTasks = await getChampTasks({
      champid: CSP.chapter.champid,
    });
    tasks = champTasks.data.tasks;
  }

  if (nodemode == "textbook") {
    const tasks = await getTextBook({
      userProgress: CSP.user.progress,
      courseid,
    });
    openTextBook({
      courseid: CSP.chapter.courseid,
      tasks,
    });
  }

  if (taskstage == "recap_suspended") {
    CSP.chapter.nodemode == "renewal"
      ? openCongratPage({ nodemode, pts, remainsum, success: false })
      : openRecapTasksPage({
          chapter: { state: CSP.chapter, allTasks: tasks },
        });
  }

  if (taskstage == "accomplished_suspended") {
    openCongratPage({ nodemode, pts, remainsum, success: false });
  }

  if (taskstage == "recap") {
    const recapTasks = getTasksRecap(CSP.chapter.recapTasksIds, tasks);
    chapter.setAllTasks(recapTasks, CSP.task.currTaskId);
  }

  if (taskstage == "WIP") {
    chapter.setAllTasks(tasks, CSP.task.currTaskId);
  }
};

//STATE MANAGEMENT
const fetchUserMetaAndPersist = async (courseid) => {
  const userProgress = await getUserProgress(courseid);
  return userProgress;
};

//PAGES NAVIGATION
const closeCongratPage = async (success) => {
  const {
    chapterid,
    tobeunlocked,
    pts,
    tasklog,
    courseid,
    repeat,
    nodemode,
    champid,
  } = chapter.state;
  const { unlocked, completed, rating, lastunlocked } = user.progress;
  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "renewal") {
    try {
      //TODO: После фейла запроса из-за отсуттвия интернета кнока сохранить не нажимается
      progressStore.setShowProgress(true);
      let dataToEncrypt;

      const common = {
        lastcompleted: chapterid,
        repeat,
        pts: rating + pts,
        uid: user.userid,
        tasklog,
        courseid: courseid,
        sum: (user.progress.stat[chapterid]?.sum ?? 0) + pts,
      };

      if (success) {
        dataToEncrypt = {
          completed: [...completed, chapterid],
          unlocked: tobeunlocked,
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
      await openFlowPageAfterAccomplished();
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
    updateChampTaskLog({ tasklog, champid });
    openSpecChampPage({ champid });
  }
};

const openAndRefreshFlowPage = async (courseid) => {
  chapter.setFlow({});
  const progress = await fetchUserMetaAndPersist(courseid);

  const flow = await setFlowNodes({
    courseid,
    progress,
    openLessonStartPage,
    openAndRefreshFlowPage: async () => await openAndRefreshFlowPage(courseid),
  });

  chapter.setFlow(flow);
  navigator.updateAppState({ page: "flow" });
  chapter.updateState({ courseid });
  user.setProgress(progress);
};

const openCourseFlowPageFromMain = async (courseid) => {
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

const openFlowPageAfterAccomplished = async () => {
  await openAndRefreshFlowPage(chapter.state.courseid);
};

const openTextBook = async ({ courseid, tasks }) => {
  if (tasks.length) {
    chapter.setAllTasks(tasks, 0);
    chapter.updateState({ ...initials.textBook.chapter, courseid });
    navigator.updateAppState({ ...initials.textBook.navigator });
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

const openAllCoursePage = () => {
  navigator.setAppState({ ...initials.courses.navigator });
  chapter.setAllTasks([], -1);
};

const openChampPage = () => {
  navigator.setAppState({ ...initials.champ.navigator });
};

const openSpecChampPage = ({ champid }) => {
  navigator.setAppState({ ...initials.champ.navigator });
  chapter.updateState({ champid });
};

const openLessonStartPage = async ({
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
      courseid,
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

const openLessonRunPage = async () => {
  progressStore.setShowProgress(true, false, "progressdots", 2000);
  navigator.updateAppState({ ...initials.lessonRun.navigator });
};

const finalizePts = ({ nodemode, pts, remainsum }) => {
  if (nodemode == "addhoc" || nodemode == "newtopic" || nodemode == "renewal") {
    //TODO: wtf?
    return Math.min(pts, remainsum);
  }
  return pts;
};

const openCongratPage = async ({ nodemode, pts, remainsum, success }) => {
  countdownbutton.hideButton();
  const ptsFinalized = finalizePts({
    nodemode,
    pts,
    remainsum,
  });
  navigator.updateAppState({ page: "congrat" });
  chapter.updateState({ pts: ptsFinalized, success });
};

const openCongratPageInterrupted = () => {
  const { nodemode, pts, remainsum, taskstage } = chapter.state;
  let caption, text;
  if (nodemode == "renewal" || nodemode == "addhoc" || nodemode == "newtopic") {
    caption = "Завершить";
  }

  if (
    (nodemode == "newtopic" || nodemode == "addhoc") &&
    !chapter.state.repeat
  ) {
    text =
      "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n2 монеты за каждую задачу вместо 10 монет";
  }

  if (nodemode == "renewal" && !chapter.state.repeat) {
    text =
      "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n1 монету за каждую задачу вместо 2 монет";
  }

  if (chapter.state.repeat) {
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

const openTutorial = () => {
  tutorial.show();
};

const openRecapTasksPage = ({ chapter }) => {
  dialog.showDialog(
    "Повторение",
    "Попробуй еще раз решить ошибочные задачи",
    1,
    () => {}
  );
  setRecapTasks(chapter);
};

const runChamp = async (champid) => {
  openLessonStartPage({
    champid,
    nodemode: "champ",
  });
};

const openSupportPage = () => {
  window.open("http://t.me/delta1298", "_blank");
};

//TASKS MANAGEMENT

const setRecapTasks = (chapterState) => {
  chapter.setAllTasks(
    getTasksRecap(chapterState.state.recapTasksIds, chapterState.allTasks),
    0
  );
  chapter.updateState({ taskstage: "recap" });
};

const setRegularTasks = async ({
  chapterid,
  courseid,
  repeat,
  overflow,
  remainsum,
  nodemode,
  tobeunlocked,
}) => {
  const tasks = await getAllTasksFromChapter(chapterid, courseid);
  chapter.setAllTasks(tasks, initials.regularTasks.task.currTaskId);
  chapter.updateState({
    ...initials.regularTasks.chapter,
    courseid,
    chapterid,
    repeat,
    overflow,
    remainsum,
    nodemode,
    tobeunlocked,
  });
  navigator.updateAppState({ ...initials.regularTasks.navigator });
};

const setRandomTasksToRepeat = async ({
  chapterid,
  courseid,
  repeat,
  overflow,
  nodemode,
  level,
  remainsum,
  tobeunlocked,
}) => {
  try {
    const { tasksuuids, tasksFetched } = await getRandomTasksForRepeat({
      courseid,
      levelStart: level - 5,
      levelEnd: level,
      randomsaved: chapter.state.randomsaved,
    });
    console.log("tasksuuids, tasksFetched", tasksuuids, tasksFetched);

    chapter.setAllTasks(tasksFetched, initials.regularTasks.task.currTaskId);
    chapter.updateState({
      ...initials.regularTasks.chapter,
      courseid,
      chapterid,
      repeat,
      overflow,
      nodemode,
      level,
      remainsum,
      tobeunlocked,
      randomsaved: tasksuuids,
    });
    navigator.updateAppState({ ...initials.regularTasks.navigator });
  } catch (e) {
    console.log(e);
    console.error("some error");
  }
};

const setChampTasks = async ({ champid }) => {
  const tasks = await getChampTasks({
    champid,
  });
  chapter.setAllTasks(tasks.data.tasks, initials.champTasks.task.currTaskId);
  chapter.updateState({ champid, ...initials.champTasks.chapter });
  navigator.updateAppState({ ...initials.champTasks.navigator });
};
