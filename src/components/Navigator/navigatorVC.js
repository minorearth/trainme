import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { setCSP, getCSP, getSense } from "@/db/localstorage";
import user from "@/store/user";
import {
  getAllTestsFromChapter,
  setFlowNodes,
  getTestsRecap,
  getTextBook,
  getRandomTasksForRepeat,
  getRandomTasksForChamp,
  getChampTasks,
  updateChampPoins,
} from "./navigatorVM";
import { getUseMetaData, checkCoursePaid } from "@/db/SA/firebaseSA";
import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { setUseMetaData } from "@/db/SA/firebaseSA";
import { getTargetsBySource } from "./utils";
import progressStore from "../common/progress/progressStore";
import alertdialog from "@/store/dialog";
import dialog from "@/store/dialog";

const useNavigator = () => {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [appState, setappState] = useState({});
  const [flow, setFlow] = useState();

  const initialState = {
    page: "courses",
  };

  useEffect(() => {
    //TODO: uncomment
    // document.addEventListener("copy", (e) => {
    //   e.clipboardData.setData("text/plain", "No Copying!");
    //   e.preventDefault();
    // });
    loadPTrek();
  }, [user]);

  const loadPTrek = async () => {
    //TODO:load username
    const CSP = getCSP();
    const page = CSP?.page || "courses";
    if (page == "flow" || page == "congrat") {
      const coursePaid = await checkCoursePaid(CSP.launchedCourse, user.userid);
      if (coursePaid) {
        openAndRefreshFlowPage(CSP.launchedCourse);
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
      openAndRefreshFlowPage: () => openAndRefreshFlowPage(courseid),
    });
    return flow;
  };

  //STATE MANAGEMENT
  const fetchUserMetaAndPersist = async (launchedCourse) => {
    const CSP = getCSP();
    const allUserMeta = await getUseMetaData(user.userid);
    //TODO:keep only keys needed
    const userProgress = allUserMeta.courses[launchedCourse];

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
    progressStore.setCloseProgress();
  };

  const openCourseFlowPageFromMain = async (launchedCourse) => {
    progressStore.setShowProgress(true, false, "progressdots", 2000);

    const coursePaid = await checkCoursePaid(launchedCourse, user.userid);
    if (!coursePaid) {
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
    openAndRefreshFlowPage(launchedCourse);
  };

  const openFlowPageAfterAccomplished = () => {
    //Clean-up CSP
    const CSP = getCSP();
    setCSP({
      launchedCourse: CSP.launchedCourse,
      page: "flow",
      userProgress: CSP.userProgress,
    });
    openAndRefreshFlowPage(CSP.launchedCourse);
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
      setStateAndCSP({
        launchedCourse: CSP.launchedCourse,
        page: "flow",
        userProgress: CSP.userProgress,
      });
      loadFlowNodes(CSP.launchedCourse, CSP);
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
      setRegularTasks({
        chapter,
        courseid,
        repeat,
        overflow,
        remainsum,
        nodemode,
        tobeunlocked,
      });
    }
  };

  const openCongratPage = async ({ CSP }) => {
    let pts;
    if (
      CSP.nodemode == "addhoc" ||
      CSP.nodemode == "newtopic" ||
      CSP.nodemode == "renewal"
    ) {
      pts = Math.min(getSense(), CSP.remainsum);
      // const unlocked = getTargetsBySource(
      //   CSP.chapter,
      //   flow.edges
      // );

      await setUseMetaData(
        encrypt2({
          lastcompleted: CSP.chapter,
          unlocked: CSP.tobeunlocked,
          pts,
          uid: user.userid,
          tasklog: CSP.tasklog,
          launchedCourse: CSP.launchedCourse,
        })
      );
      setStateAndCSP({
        page: "congrat",
        pts,
        launchedCourse: CSP.launchedCourse,
        userProgress: CSP.userProgress,
        nodemode: CSP.nodemode,
      });
    }

    if (CSP.nodemode == "champ") {
      pts = getSense();
      setStateAndCSP({
        page: "congrat",
        champid: CSP.champid,
        pts,
        // launchedCourse: CSP.launchedCourse,
        userProgress: CSP.userProgress,
        nodemode: CSP.nodemode,
      });
    }
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

  //TASKS MANAGEMENT

  const recoverTestsInProgress = async ({ CSP }) => {
    let tasks;
    const nodemode = CSP.nodemode;
    const taskstage = CSP.taskstage;
    if (nodemode == "renewal") {
      tasks = await getRandomTasksForRepeat({
        courseid: CSP.launchedCourse,
        levelStart: CSP.level - 5,
        levelEnd: CSP.level,
      });
    }
    if (nodemode == "addhoc" || nodemode == "newtopic") {
      tasks = await getAllTestsFromChapter(CSP.chapter, CSP.launchedCourse);
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
    });
    const tasks = await getRandomTasksForRepeat({
      chapter,
      courseid,
      levelStart: level - 5,
      levelEnd: level,
    });
    setTests(tasks);
  };

  const setChampTasks = async ({ champid }) => {
    updateStateAndCSP({
      champid,
      page: "testsStarted",
      taskId: 0,
      recapTasksIds: [],
      taskstage: "WIP",
      nodemode: "champ",
    });
    const tasks = await getChampTasks({
      champid,
    });
    setTests(tasks.data.tasks);
  };

  return {
    actions: {
      updateStateAndCSP,
      setStateAndCSP,
      setappState,

      openFlowPageAfterAccomplished,
      openTestsStartedPage,
      openChampPage,
      openAllCoursePage,
      openCongratPage,
      openAndRefreshFlowPage,
      openRecapTasksPage,
      openSpecChampPage,
      openCourseFlowPageFromMain,

      interruptExamMode,
      getRandomTasksForChamp,
      updateChampPoins,
      runChamp,
      setRecapTasks,
    },
    appState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
