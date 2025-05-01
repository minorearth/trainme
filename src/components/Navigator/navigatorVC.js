import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { setCSP, getCSP, getSense } from "@/db/localstorage";
import user from "@/store/user";
import tutorial from "@/components/tutorial/store";

import { signOutUserClient } from "@/db/domain/domain";

import {
  getAllTestsFromChapter,
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
import { setUseMetaData } from "@/db/SA/firebaseSA";
import { getTargetsBySource } from "./utils";
import progressStore from "../common/splash/progressdots/store";
import alertdialog from "@/components/common/dialog/store";
import dialog from "@/components/common/dialog/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import { useRouter } from "next/navigation";
import { set } from "mobx";
import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

const useNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [appState, setappState] = useState({});
  const [flow, setFlow] = useState();
  const router = useRouter();

  const initialState = {
    page: "courses",
  };

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
    setappState((state) => {
      const newState = { ...state, ...data };
      setCSP(newState);
      return newState;
    });
  };

  const setStateAndCSP = (data) => {
    setCSP(data);
    setappState(data);
  };

  const saveProgress = async () => {
    const CSP = getCSP();
    if (
      CSP.nodemode == "addhoc" ||
      CSP.nodemode == "newtopic" ||
      CSP.nodemode == "renewal"
    ) {
      try {
        // progressStore.setShowProgress(true);
        // await setDataFetch({
        //   type: "wakeup",
        //   data: {},
        // });
        const res = await setDataFetch({
          type: "setusermetadata",
          data: {
            lastcompleted: CSP.chapter,
            unlocked: CSP.tobeunlocked,
            allunlocked: [...CSP.userProgress.unlocked, ...CSP.tobeunlocked],
            pts: CSP.userProgress.rating + CSP.pts,
            uid: user.userid,
            tasklog: CSP.tasklog,
            launchedCourse: CSP.launchedCourse,
            sum: (CSP.userProgress.stat[CSP.chapter]?.sum ?? 0) + CSP.pts,
          },
        });
        if (res == "error") {
          throw new Error("Это искусственная ошибка");
        }

        // alertdialog.hideDialog();
        openFlowPageAfterAccomplished();
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

    if (
      !coursePaid ||
      launchedCourse == "a3905595-437e-47f3-b749-28ea5362bd39"
    ) {
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
      setTests(tasks);
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

  const interruptExamMode = () => {
    const CSP = getCSP();
    if (CSP.nodemode != "champ") {
      openCongratPage({ CSP });
      // setStateAndCSP({
      //   launchedCourse: CSP.launchedCourse,
      //   page: "flow",
      //   userProgress: CSP.userProgress,
      // });
      // loadFlowNodes(CSP.launchedCourse, CSP);
    } else {
      openAllCoursePage();
    }
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
    console.log(nodemode);
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

  const openCongratPage = async ({ CSP }) => {
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
        openCongratPage({ CSP });
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
      () => setRecapTasks(recapTasksIds, tasks)
    );
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
      tasks = await getAllTestsFromChapter(CSP.chapter, CSP.launchedCourse);
    }

    if (nodemode == "champ") {
      const champTasks = await getChampTasks({
        champid: CSP.champid,
      });
      tasks = champTasks.data.tasks;
    }

    if (nodemode == "textbook") {
      //TODO: removee all updateStaates
      openTextBook({
        courseid: CSP.launchedCourse,
        CSP,
      });
    }

    if (taskstage == "recap_suspended") {
      openRecapTasksPage(CSP.recapTasksIds, tasks);
    }

    if (taskstage == "accomplished_suspended") {
      openCongratPage({ CSP });
    }

    if (taskstage == "recap") {
      const recapTests = getTestsRecap(CSP.recapTasksIds, tasks);
      setTests(recapTests);
    }

    if (taskstage == "WIP") {
      setTests(tasks);
    }
  };

  const setRecapTasks = (recapTasksIds, tasks) => {
    const CSP = getCSP();
    setStateAndCSP({ ...CSP, taskstage: "recap", taskId: 0 });
    setTests(getTestsRecap(recapTasksIds, tasks));
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
    await setDataFetch({
      type: "unlockandcomplete",
      data: encrypt2({
        lastcompleted: chapter,
        unlocked: tobeunlocked,
        uid: user.userid,
        launchedCourse: courseid,
      }),
    });

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
    const tasks = await getAllTestsFromChapter(chapter, courseid);
    setTests(tasks);
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
      console.log(tasksFetched);

      //TODO: proactively open chapters. Remade
      await setUseMetaUnlockedAndCompleted(
        encrypt2({
          lastcompleted: chapter,
          unlocked: tobeunlocked,
          uid: user.userid,
          launchedCourse: courseid,
        })
      );
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

      setTests(tasksFetched);
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
    setTests(tasks.data.tasks);
  };

  return {
    actionsNAV: {
      updateStateAndCSP,
      setStateAndCSP,
      setappState,

      openFlowPageAfterAccomplished,
      openTestsStartedPage,
      openChampPage,
      openAllCoursePage,
      openCongratPage,
      openCongratPageInterrupted,
      openAndRefreshFlowPage,
      openRecapTasksPage,
      openSpecChampPage,
      openCourseFlowPageFromMain,
      openLoginPageSignOut,
      openSupportPage,
      openTutorial,
      saveProgress,
      interruptExamMode,
      getRandomTasksForChamp,
      updateChampPoins,
      updateChampTaskLog,
      runChamp,
      setRecapTasks,
    },
    appState,
    loading,
    tests,
    flow,
  };
};

export default useNavigator;

// const openCongratPage = async ({ CSP }) => {
//   countdownbutton.hideButton();
//   let pts;
//   if (
//     CSP.nodemode == "addhoc" ||
//     CSP.nodemode == "newtopic" ||
//     CSP.nodemode == "renewal"
//   ) {
//     pts = Math.min(getSense(), CSP.remainsum);
//     await setUseMetaData(
//       encrypt2({
//         lastcompleted: CSP.chapter,
//         unlocked: CSP.tobeunlocked,
//         pts,
//         uid: user.userid,
//         tasklog: CSP.tasklog,
//         launchedCourse: CSP.launchedCourse,
//       })
//     );
//     setStateAndCSP({
//       page: "congrat",
//       pts,
//       launchedCourse: CSP.launchedCourse,
//       userProgress: CSP.userProgress,
//       nodemode: CSP.nodemode,
//     });
//   }

//   if (CSP.nodemode == "champ") {
//     pts = getSense();
//     updateChampTaskLog(CSP.tasklog, CSP.champid);
//     setStateAndCSP({
//       page: "congrat",
//       champid: CSP.champid,
//       pts,
//       // launchedCourse: CSP.launchedCourse,
//       userProgress: CSP.userProgress,
//       nodemode: CSP.nodemode,
//     });
//   }
// };
