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
} from "./navigatorVM";
import { getUseMetaData } from "@/db/SA/firebaseSA";
import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { setUseMetaData } from "@/db/SA/firebaseSA";
import { getTargetsBySource } from "./utils";
import progressStore from "../common/progress/progressStore";
import { getSense } from "@/db/localstorage";
import alertdialog from "@/store/dialog";

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
  };

  const showtests = async (appStatePersisted, courseid) => {
    const tasks = await getTests(appStatePersisted.chapter, courseid);
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
    } else {
      setFlowNodes({
        courseid,
        progress: appStatePersisted.userProgress,
        setFlow,
        setTestsStartedPage,
        loadCourse: () => loadCourse(courseid),
      });
    }
  };

  const loadCourse = async (id) => {
    const statePersisted = await refetchUserMetaAndPersist();
    if (id) {
      changeState({ ...statePersisted, launchedCourse: id, page: "flow" });
      await loadCourseFlow(id, statePersisted);
    }
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const reloadCourse = async () => {
    const statePersisted = await refetchUserMetaAndPersist();
    statePersisted.launchedCourse &&
      (await loadCourseFlow(statePersisted.launchedCourse, statePersisted));
    changeState({ ...statePersisted });
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const refetchUserMetaAndPersist = async () => {
    const userProgress = await getUseMetaData(user.userid);
    const state = loadStatePersisted();
    const stateToUpdated = {
      ...initialState,
      ...state,
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
    reloadCourse();
  }, [user]);

  const changeState = (data) => {
    setappState((state) => {
      const newState = { ...state, ...data };
      persistState(newState);
      return newState;
    });
  };

  const setTestsStartedPage = async ({
    chapter,
    repeat,
    overflow,
    textbook,
    appState,
    remainsum,
    courseid,
  }) => {
    if (textbook) {
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
    } else {
      changeState({
        chapter,
        page: "testsStarted",
        taskId: 0,
        recapTasks: [],
        taskstage: "WIP",
        repeat,
        overflow,
        remainsum,
      });
      const tasks = await getTests(chapter, courseid);
      setTests(tasks);
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
    changeState({ page: "flow", pts: 0, taskstage: "" });
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
