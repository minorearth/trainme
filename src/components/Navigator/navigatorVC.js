import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  persistState,
  loadStatePersisted,
  updateStateLS,
} from "@/db/localstorage";
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
import { getSense } from "@/db/localstorage";
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
    const currStatePersisted = loadStatePersisted();
    const page = currStatePersisted?.page || "courses";

    if (page == "flow" || page == "congrat") {
      const coursePaid = await checkCoursePaid(
        currStatePersisted.launchedCourse,
        user.userid
      );

      if (coursePaid) {
        openAndRefreshFlowPage(currStatePersisted.launchedCourse);
      } else {
        openAllCoursePage();
      }
    }

    if (page == "testrun" || page == "congrat" || page == "testsStarted") {
      recoverTestsInProgress(currStatePersisted);
      //to get edges on Accomplish
      loadFlowNodes(currStatePersisted.launchedCourse, currStatePersisted);

      changeState({
        ...currStatePersisted,
      });
    }

    if (!page || page == "courses" || page == "champ") {
      resetStateToInitial();
    }

    setLoading(false);
    progressStore.setCloseProgress();
  };

  const loadFlowNodes = async (courseid, appStatePersisted) => {
    setFlowNodes({
      courseid,
      progress: appStatePersisted.userProgress,
      setFlow,
      openTestsStartedPage,
      openAndRefreshFlowPage: () => openAndRefreshFlowPage(courseid),
    });
  };

  //STATE MANAGEMENT
  const refetchUserMetaAndPersist = async (launchedCourse) => {
    const currStatePersisted = loadStatePersisted();
    const allUserMeta = await getUseMetaData(user.userid);
    const userProgress = allUserMeta.courses[launchedCourse];

    const stateToUpdate = {
      ...currStatePersisted,
      userProgress,
    };
    // const stateUpdated = updateStateLS(stateToUpdated);
    persistState(stateToUpdate);
    return stateToUpdate;
  };

  const resetStateToInitial = async () => {
    const stateToUpdated = {
      ...initialState,
    };
    const stateUpdated = updateStateLS(stateToUpdated);
    changeState({ ...stateUpdated });
  };

  const changeState = (data) => {
    setappState((state) => {
      const newState = { ...state, ...data };
      persistState(newState);
      return newState;
    });
  };

  const setState = (data) => {
    persistState(data);
    setappState({ ...data });
  };

  const updateLSState = (data) => {
    const state = loadStatePersisted();
    persistState({ ...state, ...data });
  };

  //PAGES NAVIGATION
  const openAndRefreshFlowPage = async (launchedCourse) => {
    setFlow();
    const statePersisted = await refetchUserMetaAndPersist(launchedCourse);
    await loadFlowNodes(launchedCourse, statePersisted);

    setState({
      ...statePersisted,
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
    console.log("here");
    persistState({
      launchedCourse: appState.launchedCourse,
      page: "flow",
      userProgress: appState.userProgress,
    });
    openAndRefreshFlowPage(appState.launchedCourse);
  };

  const openTextBook = async ({ chapter, courseid, appState }) => {
    const tasks = await getTextBook(appState, courseid);
    if (tasks.length) {
      changeState({
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
    setState(initialState);
  };

  const interruptExamMode = () => {
    setState({
      launchedCourse: appState.launchedCourse,
      page: "flow",
      userProgress: appState.userProgress,
    });
    loadFlowNodes(appState.launchedCourse, appState);
  };

  const openChampPage = () => {
    changeState({ page: "champ" });
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
  }) => {
    if (nodemode == "champ") {
      setChampTasks({
        chapter,
        champid,
        appState,
        nodemode,
      });
    }
    if (nodemode == "textbook") {
      openTextBook({
        courseid,
        appState,
        nodemode,
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
      });
    }
  };

  const openCongratPage = async () => {
    const pts = Math.min(getSense(), appState.remainsum);

    if (
      appState.nodemode == "addhoc" ||
      appState.nodemode == "newtopic" ||
      appState.nodemode == "renewal"
    ) {
      const unlocked = getTargetsBySource(appState.chapter, flow.edges);

      await setUseMetaData(
        encrypt2({
          lastcompleted: appState.chapter,
          unlocked,
          pts,
          uid: user.userid,
          launchedCourse: appState.launchedCourse,
        })
      );
    }

    if (appState.nodemode == "champ") {
    }

    changeState({ page: "congrat", pts });
  };

  const doRecap = (recapTasksIds, tasks) => {
    // const pts = getSense();
    // changeState({ taskstage: "recap", pts });
    // changeState({ taskstage: "recap"});

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

  const recoverTestsInProgress = async (appStatePersisted) => {
    let tasks;

    if (appStatePersisted.nodemode == "renewal") {
      tasks = await getRandomTasksForRepeat({
        courseid: appStatePersisted.launchedCourse,
        levelStart: appStatePersisted.level - 5,
        levelEnd: appStatePersisted.level,
      });
    }

    if (
      appStatePersisted.nodemode == "addhoc" ||
      appStatePersisted.nodemode == "newtopic"
    ) {
      tasks = await getAllTestsFromChapter(
        appStatePersisted.chapter,
        appStatePersisted.launchedCourse
      );
    }

    if (appStatePersisted.nodemode == "textbook") {
      changeState(initialState);
    }

    if (appStatePersisted.taskstage == "recap_suspended") {
      doRecap(appStatePersisted.recapTasksIds, tasks);
    }

    if (appStatePersisted.taskstage == "accomplished_suspended") {
      openCongratPage();
    }

    if (appStatePersisted.taskstage == "recap") {
      const recapTests = getTestsRecap(appStatePersisted.recapTasksIds, tasks);
      setTests(recapTests);
    }

    if (appStatePersisted.taskstage == "WIP") {
      setTests(tasks);
    }
  };

  // const processSuspendedAfterError = async () => {
  //   switch (true) {
  //     case appState.taskId == tests.length - 1 &&
  //       appState.taskstage == "accomplished_suspended":
  //       openCongratPage();
  //       return;
  //     case appState.taskId == tests.length - 1 &&
  //       appState.taskstage == "recap_suspended":
  //       doRecap();
  //       return;
  //     default:
  //       return "";
  //   }
  // };

  const setRecapTasks = (recapTasksIds, tasks) => {
    changeState({ taskstage: "recap", taskId: 0 });
    setTests(getTestsRecap(recapTasksIds, tasks));
  };

  const setRegularTasks = async ({
    chapter,
    courseid,
    repeat,
    overflow,
    remainsum,
    nodemode,
  }) => {
    changeState({
      chapter,
      page: "testsStarted",
      taskId: 0,
      recapTasksIds: [],
      taskstage: "WIP",
      repeat,
      overflow,
      remainsum,
      nodemode,
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
  }) => {
    changeState({
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
    changeState({
      champid,
      page: "testsStarted",
      taskId: 0,
      recapTasksIds: [],
      taskstage: "WIP",
      nodemode,
    });
    const tasks = await getChampTasks({
      champid,
    });
    setTests(tasks.data.tasks);
  };

  return {
    actions: {
      changeState,
      setState,
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
      doRecap,
    },
    appState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
