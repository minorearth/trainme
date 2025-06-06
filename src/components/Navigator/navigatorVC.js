import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { setCSP, getCSP, getSense } from "@/db/localstorage";
import user from "@/store/user";
import AS from "@/store/appstate";
import tutorial from "@/components/tutorial/store";

import { signOutUserClient } from "@/db/domain/domain";

import {
  getAllTasksFromChapter,
  setFlowNodes,
  getTestsRecap,
  getTextBook,
  getRandomTasksForRepeat,
  getRandomTasksForChamp,
  getChampTasks,
  updateChampPoins,
  updateChampTaskLog,
} from "./navigatorVM";
import {
  getUseMetaData,
  checkCoursePaid,
  setUseMetaUnlockedAndCompleted,
} from "@/db/SA/firebaseSA";
import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import progressStore from "../common/splash/progressdots/store";
import alertdialog from "@/components/common/dialog/store";
import dialog from "@/components/common/dialog/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import { useRouter } from "next/navigation";
import { getReadyCourses } from "@/globals/courses";

import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

const useNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTasks] = useState([]);
  const [flow, setFlow] = useState();
  const router = useRouter();

  const initialState = {
    page: "courses",
  };

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

  const loadPTrek = async () => {
    //TODO:load username
    const CSP = getCSP();
    const page = CSP?.page || "courses";
    if (page == "flow") {
      const coursePaid = await getDataFetch({
        type: "checkcoursepaid",
        data: { courseid: CSP.launchedCourse, uid: user.userid },
      });
      if (coursePaid) {
        await openAndRefreshFlowPage(CSP.launchedCourse);
      } else {
        openAllCoursePage();
      }
    }
    if (page == "testrun" || page == "testsStarted") {
      recoverTestsInProgress({ CSP });
      setStateAndCSP({
        ...CSP,
      });
    }
    if (page == "congrat") {
      setStateAndCSP({
        ...CSP,
      });
    }

    if (!page || page == "courses" || page == "champ") {
      resetStateToInitial();
    }
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const loadFlowNodes = async (courseid, CSP) => {
    const flow = await setFlowNodes({
      courseid,
      progress: CSP.userProgress,
      setFlow,
      openTestsStartedPage,
      openAndRefreshFlowPage: async () =>
        await openAndRefreshFlowPage(courseid),
    });
    return flow;
  };

  const getUserDataNeeeded = (data) => {
    const stat = Object.keys(data.stat).reduce(
      (acc, chapterid) => ({
        ...acc,
        [chapterid]: {
          sum: data.stat[chapterid].sum,
        },
      }),
      {}
    );
    return {
      ...data,
      stat,
    };
  };

  //STATE MANAGEMENT
  const fetchUserMetaAndPersist = async (launchedCourse) => {
    const CSP = getCSP();
    const allUserMeta = await getDataFetch({
      data: { uid: user.userid },
      type: "getusermetadata",
    });
    //TODO:keep only keys needed
    const userProgress = getUserDataNeeeded(
      allUserMeta.courses[launchedCourse]
    );

    const stateToUpdate = {
      ...CSP,
      userProgress,
    };
    setCSP(stateToUpdate);
    return stateToUpdate;
  };
  const resetStateToInitial = async () => {
    setStateAndCSP(initialState);
  };

  const updateStateAndCSP = (data) => {
    setCSP({ ...AS.as, ...data });
    AS.updateAppState(data);
  };

  const setStateAndCSP = (data) => {
    setCSP(data);
    AS.setAppState(data);
  };

  const saveProgress = async (success) => {
    const CSP = getCSP();
    if (
      CSP.nodemode == "addhoc" ||
      CSP.nodemode == "newtopic" ||
      CSP.nodemode == "renewal"
    ) {
      try {
        //TODO: После фейла запроса из-за отсуттвия интернета кнока сохранить не нажимается
        progressStore.setShowProgress(true);
        // await setDataFetch({
        //   type: "wakeup",
        //   data: {},
        // });
        let dataToEncrypt;
        if (success) {
          dataToEncrypt = {
            completed: [...CSP.userProgress.completed, CSP.chapter],
            lastcompleted: CSP.chapter,
            unlocked: CSP.tobeunlocked,
            repeat: CSP.repeat,
            allunlocked: [...CSP.userProgress.unlocked, ...CSP.tobeunlocked],
            pts: CSP.userProgress.rating + CSP.pts,
            uid: user.userid,
            tasklog: CSP.tasklog,
            launchedCourse: CSP.launchedCourse,
            sum: (CSP.userProgress.stat[CSP.chapter]?.sum ?? 0) + CSP.pts,
          };
        } else {
          dataToEncrypt = {
            completed: CSP.userProgress.completed,
            lastcompleted: CSP.chapter,
            unlocked: CSP.userProgress.lastunlocked,
            repeat: CSP.repeat,
            allunlocked: CSP.userProgress.unlocked,
            pts: CSP.userProgress.rating + CSP.pts,
            uid: user.userid,
            tasklog: CSP.tasklog,
            launchedCourse: CSP.launchedCourse,
            sum: (CSP.userProgress.stat[CSP.chapter]?.sum ?? 0) + CSP.pts,
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

    if (CSP.nodemode == "champ") {
      updateChampTaskLog(CSP.tasklog, CSP.champid);
      openSpecChampPage({ champid: CSP.champid });
    }
  };

  //PAGES NAVIGATION
  const openAndRefreshFlowPage = async (launchedCourse) => {
    setFlow();
    const CSP = await fetchUserMetaAndPersist(launchedCourse);
    await loadFlowNodes(launchedCourse, CSP);

    setStateAndCSP({
      ...CSP,
      launchedCourse,
      page: "flow",
    });
    setLoading(false);
  };

  const openCourseFlowPageFromMain = async (launchedCourse) => {
    progressStore.setShowProgress(true, false, "progressdots", 2000);
    const coursePaid = await getDataFetch({
      type: "checkcoursepaid",
      data: { courseid: launchedCourse, uid: user.userid },
    });

    if (!coursePaid || !getReadyCourses().includes(launchedCourse)) {
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
    await openAndRefreshFlowPage(launchedCourse);
    progressStore.setCloseProgress();
  };

  const openFlowPageAfterAccomplished = async () => {
    const CSP = getCSP();
    setCSP({
      launchedCourse: CSP.launchedCourse,
      page: "flow",
      userProgress: CSP.userProgress,
    });
    await openAndRefreshFlowPage(CSP.launchedCourse);
  };

  const openTextBook = async ({ courseid, CSP }) => {
    const tasks = await getTextBook(CSP, courseid);
    if (tasks.length) {
      setStateAndCSP({
        page: "testsStarted",
        taskId: 0,
        nodemode: "textbook",
        launchedCourse: CSP.launchedCourse,
        userProgress: CSP.userProgress,
      });
      setTasks(tasks);
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
    setStateAndCSP(initialState);
  };

  const openChampPage = () => {
    setStateAndCSP({ page: "champ" });
  };

  const openSpecChampPage = ({ champid }) => {
    setStateAndCSP({ page: "champ", champid });
  };

  const openTestsStartedPage = async ({
    courseid,
    chapter,
    champid,
    repeat,
    overflow,
    remainsum,
    nodemode,
    level,
    tobeunlocked,
  }) => {
    progressStore.setShowProgress(true);
    const CSP = getCSP();
    if (nodemode == "champ") {
      setChampTasks({
        champid,
      });
    }
    if (nodemode == "textbook") {
      openTextBook({
        courseid,
        CSP,
      });
    }
    if (nodemode == "renewal") {
      setRandomTasksToRepeat({
        chapter,
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
        chapter,
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

  const openTestRunPage = async () => {
    progressStore.setShowProgress(true, false, "progressdots", 2000);
    updateStateAndCSP({ page: "testrun" });
  };

  const openCongratPage = async ({ CSP, success }) => {
    countdownbutton.hideButton();
    let pts;
    pts = getSense();
    if (
      CSP.nodemode == "addhoc" ||
      CSP.nodemode == "newtopic" ||
      CSP.nodemode == "renewal"
    ) {
      pts = Math.min(getSense(), CSP.remainsum);
    }

    updateStateAndCSP({
      ...CSP,
      page: "congrat",
      pts,
      success,
    });
  };

  const openCongratPageInterrupted = () => {
    const CSP = getCSP();
    const nodemode = CSP.nodemode;
    let caption, text;
    if (
      nodemode == "renewal" ||
      nodemode == "addhoc" ||
      nodemode == "newtopic"
    ) {
      caption = "Завершить";
    }

    if ((nodemode == "newtopic" || nodemode == "addhoc") && !CSP.repeat) {
      text =
        "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n2 монеты за каждую задачу вместо 10 монет";
    }

    if (nodemode == "renewal" && !CSP.repeat) {
      text =
        "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n1 монету за каждую задачу вместо 2 монет";
    }

    if (CSP.repeat) {
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
        openCongratPage({ CSP, success: false });
      },
      () => {}
    );
  };

  const openTutorial = () => {
    tutorial.show();
  };

  const openRecapTasksPage = (recapTasksIds, tasks) => {
    dialog.showDialog(
      "Повторение",
      "Попробуй еще раз решить ошибочные задачи",
      1,
      () => {}
    );
    setRecapTasks(recapTasksIds, tasks);
  };

  const runChamp = async (champid) => {
    openTestsStartedPage({
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

  const recoverTestsInProgress = async ({ CSP }) => {
    let tasks;
    const nodemode = CSP.nodemode;
    const taskstage = CSP.taskstage;
    if (nodemode == "renewal") {
      const { tasksFetched } = await getRandomTasksForRepeat({
        courseid: CSP.launchedCourse,
        levelStart: CSP.level - 5,
        levelEnd: CSP.level,
      });
      tasks = tasksFetched;
    }
    if (nodemode == "addhoc" || nodemode == "newtopic") {
      tasks = await getAllTasksFromChapter(CSP.chapter, CSP.launchedCourse);
    }

    if (nodemode == "champ") {
      const champTasks = await getChampTasks({
        champid: CSP.champid,
      });
      tasks = champTasks.data.tasks;
    }

    if (nodemode == "textbook") {
      openTextBook({
        courseid: CSP.launchedCourse,
        CSP,
      });
    }

    if (taskstage == "recap_suspended") {
      CSP.nodemode == "renewal"
        ? openCongratPage({ CSP, success: false })
        : openRecapTasksPage(CSP.recapTasksIds, tasks);
    }

    if (taskstage == "accomplished_suspended") {
      openCongratPage({ CSP, success: false });
    }

    if (taskstage == "recap") {
      const recapTests = getTestsRecap(CSP.recapTasksIds, tasks);
      setTasks(recapTests);
    }

    if (taskstage == "WIP") {
      setTasks(tasks);
    }
  };

  const setRecapTasks = (recapTasksIds, tasks) => {
    const CSP = getCSP();
    setStateAndCSP({ ...CSP, taskstage: "recap", taskId: 0 });
    setTasks(getTestsRecap(recapTasksIds, tasks));
  };

  const setRegularTasks = async ({
    chapter,
    courseid,
    repeat,
    overflow,
    remainsum,
    nodemode,
    tobeunlocked,
  }) => {
    //TODO: proactively open chapters. Remade
    // await setDataFetch({
    //   type: "unlockandcomplete",
    //   data: encrypt2({
    //     lastcompleted: chapter,
    //     unlocked: tobeunlocked,
    //     uid: user.userid,
    //     launchedCourse: courseid,
    //   }),
    // });

    updateStateAndCSP({
      chapter,
      page: "testsStarted",
      taskId: 0,
      recapTasksIds: [],
      taskstage: "WIP",
      repeat,
      overflow,
      remainsum,
      nodemode,
      tobeunlocked,
      pts: 0,
      tasklog: {},
    });
    const tasks = await getAllTasksFromChapter(chapter, courseid);
    setTasks(tasks);
  };

  const setRandomTasksToRepeat = async ({
    chapter,
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
        chapter,
        courseid,
        levelStart: level - 5,
        levelEnd: level,
      });

      //TODO: proactively open chapters. Remade
      // await setUseMetaUnlockedAndCompleted(
      //   encrypt2({
      //     lastcompleted: chapter,
      //     unlocked: tobeunlocked,
      //     uid: user.userid,
      //     launchedCourse: courseid,
      //   })
      // );

      updateStateAndCSP({
        chapter,
        page: "testsStarted",
        taskId: 0,
        recapTasksIds: [],
        taskstage: "WIP",
        repeat,
        overflow,
        nodemode,
        level,
        remainsum,
        tobeunlocked,
        pts: 0,
        tasklog: {},
        randomsaved: tasksuuids,
      });

      setTasks(tasksFetched);
    } catch (e) {
      console.error("some error");
    }
  };

  const setChampTasks = async ({ champid }) => {
    updateStateAndCSP({
      champid,
      page: "testsStarted",
      taskId: 0,
      recapTasksIds: [],
      taskstage: "WIP",
      nodemode: "champ",
      tasklog: {},
    });
    const tasks = await getChampTasks({
      champid,
    });
    setTasks(tasks.data.tasks);
  };

  return {
    actionsNAV: {
      updateStateAndCSP,
      setStateAndCSP,
      openFlowPageAfterAccomplished,
      openTestsStartedPage,
      openChampPage,
      openAllCoursePage,
      openCongratPage,
      openTestRunPage,
      openCongratPageInterrupted,
      openAndRefreshFlowPage,
      openRecapTasksPage,
      openSpecChampPage,
      openCourseFlowPageFromMain,
      openLoginPageSignOut,
      openSupportPage,
      openTutorial,
      saveProgress,
      getRandomTasksForChamp,
      updateChampPoins,
      updateChampTaskLog,
      runChamp,
      setRecapTasks,
    },
    loading,
    tasks: tests,
    flow,
  };
};

export default useNavigator;
