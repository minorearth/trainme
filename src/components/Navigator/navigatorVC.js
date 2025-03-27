import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { setSCP, getSCP, updateStateLS, getSense } from "@/db/localstorage";
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
    const CSP = getSCP();
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
      setStateAndSCP({
        ...CSP,
      });
    }
    if (!page || page == "courses" || page == "champ") {
      resetStateToInitial();
    }
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const loadFlowNodes = async (courseid, SCP) => {
    const flow = await setFlowNodes({
      courseid,
      progress: SCP.userProgress,
      setFlow,
      openTestsStartedPage,
      openAndRefreshFlowPage: () => openAndRefreshFlowPage(courseid),
    });
    return flow;
  };

  //STATE MANAGEMENT
  const refetchUserMetaAndPersist = async (launchedCourse) => {
    const currStatePersisted = getSCP();
    const allUserMeta = await getUseMetaData(user.userid);
    const userProgress = allUserMeta.courses[launchedCourse];
    console.log("userProgress", allUserMeta, launchedCourse);

    const stateToUpdate = {
      ...currStatePersisted,
      userProgress,
    };
    // const stateUpdated = updateStateLS(stateToUpdated);
    setSCP(stateToUpdate);
    return stateToUpdate;
  };

  const resetStateToInitial = async () => {
    const stateUpdated = updateStateLS(initialState);
    setStateAndSCP({ ...stateUpdated });
  };

  const updateState = (data) => {
    setappState((state) => {
      const newState = { ...state, ...data };
      setSCP(newState);
      return newState;
    });
  };

  const setStateAndSCP = (data) => {
    setSCP(data);
    setappState({ ...data });
  };

  const updateLSState = (data) => {
    const state = getSCP();
    setSCP({ ...state, ...data });
  };

  //PAGES NAVIGATION
  const openAndRefreshFlowPage = async (launchedCourse) => {
    setFlow();
    const SCP = await refetchUserMetaAndPersist(launchedCourse);
    console.log("SCP", SCP);
    await loadFlowNodes(launchedCourse, SCP);

    setStateAndSCP({
      ...SCP,
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
    //Clean-up SCP
    const SCP = getSCP();
    setSCP({
      launchedCourse: SCP.launchedCourse,
      page: "flow",
      userProgress: SCP.userProgress,
    });
    openAndRefreshFlowPage(SCP.launchedCourse);
  };

  const openTextBook = async ({ courseid, SCP }) => {
    const tasks = await getTextBook(SCP, courseid);
    if (tasks.length) {
      updateState({
        page: "testsStarted",
        taskId: 0,
        nodemode: "textbook",
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
    setStateAndSCP(initialState);
  };

  const interruptExamMode = () => {
    const SCP = getSCP();
    if (SCP.nodemode != "champ") {
      setStateAndSCP({
        launchedCourse: SCP.launchedCourse,
        page: "flow",
        userProgress: SCP.userProgress,
      });
      loadFlowNodes(SCP.launchedCourse, SCP);
    } else {
      openAllCoursePage();
    }
  };

  const openChampPage = () => {
    updateState({ page: "champ" });
  };

  const openSpecChampPage = ({ champid }) => {
    setStateAndSCP({ page: "champ", champid });
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
    const SCP = getSCP();
    if (nodemode == "champ") {
      setChampTasks({
        champid,
      });
    }
    if (nodemode == "textbook") {
      openTextBook({
        courseid,
        SCP,
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

  const openCongratPage = async ({ appStatePersisted }) => {
    let pts;
    if (
      appStatePersisted.nodemode == "addhoc" ||
      appStatePersisted.nodemode == "newtopic" ||
      appStatePersisted.nodemode == "renewal"
    ) {
      pts = Math.min(getSense(), appStatePersisted.remainsum);
      // console.log("pts", pts, appStatePersisted.remainsum);
      // const unlocked = getTargetsBySource(
      //   appStatePersisted.chapter,
      //   flow.edges
      // );

      console.log("meta", {
        lastcompleted: appStatePersisted.chapter,
        unlocked: appStatePersisted.tobeunlocked,
        pts,
        uid: user.userid,
        launchedCourse: appStatePersisted.launchedCourse,
      });

      await setUseMetaData(
        encrypt2({
          lastcompleted: appStatePersisted.chapter,
          unlocked: appStatePersisted.tobeunlocked,
          pts,
          uid: user.userid,
          launchedCourse: appStatePersisted.launchedCourse,
        })
      );
    }

    if (appStatePersisted.nodemode == "champ") {
      pts = getSense();
    }

    updateState({ page: "congrat", pts });
  };

  const openRecapTasksPage = (recapTasksIds, tasks) => {
    // const pts = getSense();
    // updateState({ taskstage: "recap", pts });
    // updateState({ taskstage: "recap"});

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
      updateState(initialState);
    }

    if (taskstage == "recap_suspended") {
      openRecapTasksPage(CSP.recapTasksIds, tasks);
    }

    if (taskstage == "accomplished_suspended") {
      openCongratPage({ appStatePersisted: CSP });
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
    updateState({ taskstage: "recap", taskId: 0 });
    console.log("zu", recapTasksIds, tasks);
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
    console.log("tobeunlocked", tobeunlocked);
    updateState({
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
    updateState({
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
    });
    const tasks = await getRandomTasksForRepeat({
      chapter,
      courseid,
      levelStart: level - 5,
      levelEnd: level,
    });
    setTests(tasks);
  };

  const setChampTasks = async ({ champid, nodemode }) => {
    updateState({
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
      updateState,
      setState: setStateAndSCP,
      updateLSState,
      openFlowPageAfterAccomplished,
      openTestsStartedPage,
      openChampPage,
      openAllCoursePage,
      openCongratPage,
      interruptExamMode,
      openCourseFlowPageFromMain,
      getRandomTasksForChamp,
      updateChampPoins,
      runChamp,
      setRecapTasks,
      openAndRefreshFlowPage,
      openRecapTasksPage,
      openSpecChampPage,
    },
    appState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
