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
  getRandomTasks,
} from "./navigatorVM";
import { getUseMetaData } from "@/db/SA/firebaseSA";
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
      tasks = await getRandomTasks({
        chapter: appStatePersisted.chapter,
        courseid,
        appState: appStatePersisted,
        level: appStatePersisted.level,
        persistStateNoEffect,
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
      setTests(tasks);
    }
  };

  const loadCourseFlow = async (courseid, appStatePersisted) => {
    // const courseid = id == "" ? stateUpdated.launchedCourse : id;
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

  const loadCourse = async (launchedCourse) => {
    setFlow();
    const currStatePersisted = loadStatePersisted();
    const statePersisted = await refetchUserMetaAndPersist(
      launchedCourse,
      currStatePersisted
    );
    await loadCourseFlow(launchedCourse, statePersisted);
    changeState({ ...statePersisted, launchedCourse, page: "flow" });
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const reloadCourse = async (currStatePersisted) => {
    const statePersisted = await refetchUserMetaAndPersist(
      currStatePersisted.launchedCourse,
      currStatePersisted
    );
    await loadCourseFlow(statePersisted.launchedCourse, statePersisted);
    changeState({ ...statePersisted });
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const refetchUserMetaAndPersist = async (
    launchedCourse,
    currStatePersisted
  ) => {
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
    document.addEventListener("copy", (e) => {
      e.clipboardData.setData("text/plain", "No Copying!");
      e.preventDefault();
    });
    const currStatePersisted = loadStatePersisted();
    if (currStatePersisted && currStatePersisted.launchedCourse) {
      reloadCourse(currStatePersisted);
    } else {
      changeState(initialState);
      setLoading(false);
      progressStore.setCloseProgress();
    }
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
    const tasks = await getRandomTasks({
      chapter,
      courseid,
      appState,
      level,
      persistStateNoEffect,
    });
    setTests(tasks);
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
  }) => {
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
        appState,
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
      loadCourse,
    },
    appState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
