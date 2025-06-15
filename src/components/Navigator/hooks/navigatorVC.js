import { toJS } from "mobx";
//react stuff
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

const useNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [flow, setFlow] = useState();
  const router = useRouter();

  useEffect(() => {
    navigator.setNavigationMethods({
      openFlowPageAfterAccomplished,
      openLessonStartPage,
      openChampPage,
      openAllCoursePage,
      openCongratPage,
      openLessonRunPage,
      openCongratPageInterrupted,
      openAndRefreshFlowPage,
      openRecapTasksPage,
      openSpecChampPage,
      openCourseFlowPageFromMain,
      openLoginPageSignOut,
      openSupportPage,
      openTutorial,
      runChamp,
      closeCongratPage,
    });

    navigator.setRequestMethods({
      getRandomTasksForChamp,
      updateChampPoints,
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = "Вы уверены, что хотите покинуть страницу?";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    //TODO: uncomment
    document.addEventListener("copy", (e) => {
      e.clipboardData.setData("text/plain", "No Copying!");
      e.preventDefault();
    });
    loadPTrek();
  }, [user]);

  //Initial Load
  const loadPTrek = async () => {
    //TODO:load username
    const CSP = getCSP();
    if (!CSP) {
      updateSCP({ navigator: initials.initialState.navigator });
      navigator.setAppState(initials.initialState.navigator);
    } else {
      CSP.navigator && navigator.setAppState(CSP.navigator);
      CSP.chapter && chapter.updateState(CSP.chapter);
      CSP.task && task.setCurrTask(CSP.currTaskId);
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
      updateSCP({ navigator: initials.initialState.navigator });
      navigator.setAppState(initials.initialState.navigator);
    }
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const recoverLessonInProgress = async ({ CSP }) => {
    let tasks;
    const nodemode = CSP.chapter.nodemode;
    const taskstage = CSP.chapter.taskstage;
    if (nodemode == "renewal") {
      const { tasksFetched } = await getRandomTasksForRepeat({
        courseid: CSP.chapter.courseid,
        levelStart: CSP.chapter.level - 5,
        levelEnd: CSP.chapter.level,
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
      openTextBook({
        courseid: CSP.chapter.courseid,
      });
    }

    if (taskstage == "recap_suspended") {
      CSP.chapter.nodemode == "renewal"
        ? openCongratPage({ state: CSP, success: false })
        : openRecapTasksPage(CSP.chapter.recapTasksIds);
    }

    if (taskstage == "accomplished_suspended") {
      openCongratPage({ state: CSP, success: false });
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
    if (
      nodemode == "addhoc" ||
      nodemode == "newtopic" ||
      nodemode == "renewal"
    ) {
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
    setFlow({});
    const progress = await fetchUserMetaAndPersist(courseid);

    const flow = await setFlowNodes({
      courseid,
      progress,
      openLessonStartPage,
      openAndRefreshFlowPage: async () =>
        await openAndRefreshFlowPage(courseid),
    });

    setFlow(flow);
    updateSCP({
      navigator: { page: "flow" },
      chapter: { courseid },
      user: { progress },
    });

    navigator.updateAppState({ page: "flow" });
    chapter.updateState({ courseid });
    user.setProgress(progress);

    setLoading(false);
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
    // setCSP({
    //   chapter: { courseid: chapter.state.courseid },
    //   navigator: { page: "flow" },
    //   userProgress: user.progress,
    // });
    await openAndRefreshFlowPage(chapter.state.courseid);
  };

  const openTextBook = async ({ courseid }) => {
    const tasks = await getTextBook({ userProgress: user.progress, courseid });
    if (tasks.length) {
      //checked
      updateSCP({
        navigator: { ...initials.textBook.navigator },
        task: { ...initials.textBook.task },
        chapter: {
          courseid: chapter.state.courseid,
          ...initials.textBook.chapter,
        },
      });
      chapter.setAllTasks(tasks, 0);
      chapter.updateState({ ...initials.textBook.chapter });
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
    setCSP({ navigator: { ...initials.courses.navigator } });
    navigator.setAppState({ ...initials.courses.navigator });
    chapter.setAllTasks([], -1);
  };

  const openChampPage = () => {
    setCSP({ navigator: { ...initials.champ.navigator } });
    navigator.setAppState({ ...initials.champ.navigator });
  };

  const openSpecChampPage = ({ champid }) => {
    setCSP({
      navigator: { ...initials.champ.navigator },
      chapter: { champid },
    });
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
      openTextBook({
        courseid,
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
    updateSCP({ navigator: { ...initials.lessonRun.navigator } });
    navigator.updateAppState({ ...initials.lessonRun.navigator });
  };

  const finalizePts = ({ nodemode, pts, remainsum }) => {
    if (
      nodemode == "addhoc" ||
      nodemode == "newtopic" ||
      nodemode == "renewal"
    ) {
      //TODO: wtf?
      return Math.min(pts, remainsum);
    }
    return pts;
  };

  const openCongratPage = async ({ state, success }) => {
    countdownbutton.hideButton();
    const pts = finalizePts({
      nodemode: state.chapter.state.nodemode,
      pts: state.chapter.state.pts,
      remainsum: state.chapter.state.remainsum,
    });

    navigator.updateAppState({ page: "congrat" });
    chapter.updateState({ pts, success });
    updateSCP({
      navigator: { page: "congrat" },
      chapter: { ...chapter.state, pts, success },
    });
  };

  const openCongratPageInterrupted = () => {
    const nodemode = chapter.state.nodemode;
    let caption, text;
    if (
      nodemode == "renewal" ||
      nodemode == "addhoc" ||
      nodemode == "newtopic"
    ) {
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
          state: { chapter, navigator },
          success: false,
        });
      },
      () => {}
    );
  };

  const openTutorial = () => {
    tutorial.show();
  };

  const openRecapTasksPage = (recapTasksIds) => {
    dialog.showDialog(
      "Повторение",
      "Попробуй еще раз решить ошибочные задачи",
      1,
      () => {}
    );
    setRecapTasks(recapTasksIds);
  };

  const runChamp = async (champid) => {
    openLessonStartPage({
      champid,
      nodemode: "champ",
    });
  };

  const openLoginPageSignOut = async () => {
    await signOutUserClient();
    router.push(`/login/`);
  };

  const openSupportPage = () => {
    window.open("http://t.me/delta1298", "_blank");
  };

  //TASKS MANAGEMENT

  const setRecapTasks = (recapTasksIds) => {
    updateSCP({
      chapter: { ...chapter.state, taskstage: "recap" },
      task: { currTaskId: 0 },
    });
    chapter.setAllTasks(getTasksRecap(recapTasksIds, chapter.allTasks), 0);
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
    updateSCP({
      chapter: {
        ...initials.regularTasks.chapter,
        courseid,
        chapterid,
        repeat,
        overflow,
        remainsum,
        nodemode,
        tobeunlocked,
      },
      task: { ...initials.regularTasks.task },
      navigator: { ...initials.regularTasks.navigator },
    });
    const tasks = await getAllTasksFromChapter(chapterid, courseid);
    chapter.setAllTasks(tasks, 0);
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
      });

      setCSP({
        ...initials.regularTasks.chapter,
        ...initials.regularTasks.task,
        ...initials.regularTasks.navigator,
        chapterid,
        repeat,
        overflow,
        nodemode,
        level,
        remainsum,
        tobeunlocked,
        randomsaved: tasksuuids,
      });

      chapter.setAllTasks(tasksFetched, 0);
      chapter.updateState({
        ...initials.regularTasks.chapter,
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
      console.error("some error");
    }
  };

  const setChampTasks = async ({ champid }) => {
    //TODO: create initial states
    setCSP({
      chapter: { champid, ...initials.champTasks.chapter },
      navigator: { ...initials.champTasks.navigator },
      task: { ...initials.champTasks.task },
    });
    const tasks = await getChampTasks({
      champid,
    });
    chapter.setAllTasks(tasks.data.tasks, 0);
    chapter.updateState({ champid, ...initials.champTasks.chapter });
    navigator.updateAppState({ ...initials.champTasks.navigator });
  };

  return {
    loading,
    flow,
  };
};

export default useNavigator;
