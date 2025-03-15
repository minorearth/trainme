import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  persistState,
  loadStatePersisted,
  updateStateLS,
} from "@/db/localstorage";
import user from "@/store/user";
import {
  getTests,
  setFlowNodes,
  getTestsRecap,
  getTextBook,
  getRandomTasksForRecap,
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
import { CollectionsOutlined } from "@mui/icons-material";

const useNavigator = () => {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [appState, setappState] = useState({ launchedCourse: "" });
  const [flow, setFlow] = useState();

  const initialState = {
    launchedCourse: "",
    page: "courses",
    chapter: -1,
    taskId: 0,
    recapTasks: [],
    taskstage: "",
    pts: 0,
    randomsaved: [],
  };

  const showtests = async (appStatePersisted, courseid) => {
    let tasks;
    if (appStatePersisted.nodemode == "recap") {
      tasks = await getRandomTasksForRecap({
        courseid,
        levelStart: appStatePersisted.level - 5,
        levelEnd: appStatePersisted.level,
      });
    } else {
      tasks = await getTests(appStatePersisted.chapter, courseid);
    }

    if (
      appStatePersisted.taskstage == "recap" ||
      appStatePersisted.taskstage == "accomplished_suspended"
    ) {
      setTests(
        getTestsRecap(
          appStatePersisted.chapter,
          appStatePersisted.recapTasks,
          tasks
        )
      );
    } else if (appStatePersisted.taskstage == "textbook") {
      changeState(initialState);
    } else {
      console.log("tasks", tasks);
      setTests(tasks);
    }
  };

  const loadCourseFlow = async (courseid, appStatePersisted) => {
    console.log("appStatePersisted", appStatePersisted);
    if (appStatePersisted.chapter != -1) {
      showtests(appStatePersisted, courseid);
    }
    setFlowNodes({
      courseid,
      progress: appStatePersisted.userProgress,
      setFlow,
      setTestsStartedPage,
      loadCourse: () => loadCourse(courseid),
    });
  };

  const loadCourse = async (launchedCourse, page) => {
    setFlow();
    const statePersisted = await refetchUserMetaAndPersist(launchedCourse);
    await loadCourseFlow(launchedCourse, statePersisted);
    changeState({
      ...statePersisted,
      launchedCourse,
      page: page || "flow",
    });
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const reloadCourse = async () => {
    progressStore.setShowProgress(true, false, "progressdots", 2000);
    const currStatePersisted = loadStatePersisted();
    if (currStatePersisted?.launchedCourse) {
      const coursePaid = await checkCoursePaid(
        currStatePersisted.launchedCourse,
        user.userid
      );
      coursePaid
        ? loadCourse(currStatePersisted.launchedCourse, currStatePersisted.page)
        : setCoursePage();
    } else setCoursePage();
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const showCourse = async (launchedCourse) => {
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
      setCoursePage();
      return;
    }
    loadCourse(launchedCourse);
  };

  const refetchUserMetaAndPersist = async (launchedCourse) => {
    const currStatePersisted = loadStatePersisted();

    const allUserMeta = await getUseMetaData(user.userid);
    const userProgress = allUserMeta.courses[launchedCourse];

    const stateToUpdated = {
      ...initialState,
      ...currStatePersisted,
      userProgress,
      uid: user.userid,
    };
    const stateUpdated = updateStateLS(stateToUpdated);
    return stateUpdated;
  };

  useEffect(() => {
    //TODO: uncomment
    // document.addEventListener("copy", (e) => {
    //   e.clipboardData.setData("text/plain", "No Copying!");
    //   e.preventDefault();
    // });
    reloadCourse();
  }, [user]);

  const changeState = (data) => {
    setappState((state) => {
      const newState = { ...state, ...data };
      persistState(newState);
      return newState;
    });
  };

  const openTextBook = async ({
    chapter,
    courseid,
    repeat,
    overflow,
    appState,
  }) => {
    const tasks = await getTextBook(chapter, appState, courseid);
    if (tasks.length) {
      changeState({
        chapter,
        page: "testsStarted",
        pts: 0,
        taskId: 0,
        recapTasks: [],
        taskstage: "textbook",
        repeat,
        overflow,
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

  const openRecapTasks = async ({
    chapter,
    courseid,
    repeat,
    overflow,
    appState,
    nodemode,
    level,
    remainsum,
  }) => {
    changeState({
      chapter,
      page: "testsStarted",
      taskId: 0,
      recapTasks: [],
      taskstage: "WIP",
      repeat,
      overflow,
      nodemode,
      level,
      remainsum,
    });
    const tasks = await getRandomTasksForRecap({
      chapter,
      courseid,
      levelStart: level - 5,
      levelEnd: level,
    });
    setTests(tasks);
  };

  const openChampTasks = async ({
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
      recapTasks: [],
      taskstage: "WIP",
      repeat,
      overflow,
      nodemode,
      level,
      remainsum,
    });
    const tasks = await getChampTasks({
      champid: courseid,
    });
    setTests(tasks.data.tasks);
  };

  const openTasks = async ({
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
      recapTasks: [],
      taskstage: "WIP",
      repeat,
      overflow,
      remainsum,
      nodemode,
    });
    const tasks = await getTests(chapter, courseid);
    setTests(tasks);
  };

  const setTestsStartedPage = async ({
    chapter,
    repeat,
    overflow,
    textbook,
    remainsum,
    courseid,
    nodemode,
    level,
    champ,
  }) => {
    if (champ) {
      openChampTasks({
        chapter,
        courseid,
        repeat,
        overflow,
        appState,
        nodemode: "champ",
      });
    }
    if (textbook) {
      openTextBook({
        chapter,
        courseid,
        repeat,
        overflow,
        appState,
        nodemode: "textbook",
      });
    }
    if (nodemode == "recap") {
      openRecapTasks({
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
      openTasks({ chapter, courseid, repeat, overflow, remainsum, nodemode });
    }
  };

  const setRunTestsPageRecap = (recapTasks) => {
    changeState({ taskstage: "recap", taskId: 0 });
    setTests(getTestsRecap(appState.chapter, recapTasks, tests));
  };

  const setCongratPage = (pts) => {
    changeState({ page: "congrat", pts });
  };

  const setCoursePage = () => {
    changeState(initialState);
  };

  const setTestInterrupted = () => {
    changeState({ page: "flow", taskstage: "", chapter: "-1" });
  };

  const setTestAccomplished = () => {
    changeState({
      page: "flow",
      pts: 0,
      taskstage: "",
      randomsaved: [],
      chapter: "-1",
    });
  };

  const persistStateNoEffect = (data) => {
    const state = loadStatePersisted();
    persistState({ ...state, ...data });
  };

  const runAccomplish = async () => {
    const pts = Math.min(getSense(), appState.remainsum);

    if (appState.nodemode != "champ") {
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
    } else {
    }

    setCongratPage(pts);
  };

  return {
    actions: {
      changeState,
      persistStateNoEffect,
      setRunTestsPageRecap,
      setTestAccomplished,
      setTestInterrupted,
      setTestsStartedPage,
      setCongratPage,
      runAccomplish,
      showCourse,
      loadCourse,
      getRandomTasksForChamp,
      updateChampPoins,
    },
    appState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
