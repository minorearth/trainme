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

  useEffect(() => {
    //TODO: uncomment
    // document.addEventListener("copy", (e) => {
    //   e.clipboardData.setData("text/plain", "No Copying!");
    //   e.preventDefault();
    // });
    loadPTrek();
  }, [user]);

  const setTestsInProgress = async (appStatePersisted) => {
    let tasks;
    // if (appStatePersisted.chapter != -1) {
    // const page = appStatePersisted.page;
    // if (page != "testrun" && page != "congrat" && page != "testsStarted") {
    //   return;
    // }

    if (appStatePersisted.nodemode == "repeat") {
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
    }
    if (appStatePersisted.taskstage == "textbook") {
      changeState(initialState);
    }
    if (appStatePersisted.taskstage == "WIP") {
      setTests(tasks);
    }
  };

  const loadCourseFlow = async (courseid, appStatePersisted) => {
    // if (appStatePersisted.chapter != -1) {
    //   setTestsInProgress(appStatePersisted, courseid);
    // }
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
    const statePersisted = await refetchUserMetaAndPersist(launchedCourse);
    await loadCourseFlow(launchedCourse, statePersisted);

    changeState({
      ...statePersisted,
      launchedCourse,
      page: "flow",
    });
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const loadPTrek = async () => {
    const currStatePersisted = loadStatePersisted();
    const page = currStatePersisted.page;
    if (page == "flow") {
      const statePersisted = await refetchUserMetaAndPersist(
        currStatePersisted.launchedCourse
      );

      const coursePaid = await checkCoursePaid(
        statePersisted.launchedCourse,
        user.userid
      );
      if (coursePaid) {
        loadCourseFlow(statePersisted.launchedCourse, statePersisted);
        changeState({
          ...statePersisted,
          // launchedCourse,
        });
        // loadCourse(currStatePersisted.launchedCourse, currStatePersisted.page);
      } else {
        setCoursePage();
      }
    }

    if (page == "testrun" || page == "congrat" || page == "testsStarted") {
      setTestsInProgress(currStatePersisted);
    }
    changeState({
      ...currStatePersisted,
      // launchedCourse,
    });

    setLoading(false);
    progressStore.setCloseProgress();
  };

  // const reloadPyTrek = async () => {
  //   progressStore.setShowProgress(true, false, "progressdots", 2000);
  //   const currStatePersisted = loadStatePersisted();
  //   if (currStatePersisted?.launchedCourse) {
  //     const coursePaid = await checkCoursePaid(
  //       currStatePersisted.launchedCourse,
  //       user.userid
  //     );
  //     if (coursePaid && currStatePersisted.page == "flow") {
  //       loadCourse(currStatePersisted.launchedCourse, currStatePersisted.page);
  //     } else {
  //       setCoursePage();
  //     }
  //   } else setCoursePage();
  //   setLoading(false);
  //   progressStore.setCloseProgress();
  // };

  const handleCourseClick = async (launchedCourse) => {
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

  const openRandomTasksToRepeat = async ({
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
    const tasks = await getRandomTasksForRepeat({
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

  const runChamp = async (chapmid) => {
    setTestsStartedPage({
      // chapter: chapmid,
      repeat: false,
      campid: chapmid,
      nodemode: "champ",
      textbook: false,
      champ: true,
      // level,
    });
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
    const tasks = await getAllTestsFromChapter(chapter, courseid);
    setTests(tasks);
  };

  const setTestsStartedPage = async ({
    chapter,
    repeat,
    overflow,
    remainsum,
    courseid,
    nodemode,
    level,
  }) => {
    if (nodemode == "champ") {
      openChampTasks({
        chapter,
        courseid,
        repeat,
        overflow,
        appState,
        nodemode,
      });
    }
    if (nodemode == "textbook") {
      openTextBook({
        chapter,
        courseid,
        repeat,
        overflow,
        appState,
        nodemode,
      });
    }
    if (nodemode == "repeat") {
      openRandomTasksToRepeat({
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

  const setFlowPage = () => {
    loadCourse(appState.launchedCourse);
    changeState({
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

  const runAccomplishAndShowCongratPage = async () => {
    const pts = Math.min(getSense(), appState.remainsum);

    if (
      appState.nodemode == "addhoc" ||
      appState.nodemode == "newtopic" ||
      appState.nodemode == "repeat"
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

    setCongratPage(pts);
  };

  return {
    actions: {
      changeState,
      persistStateNoEffect,
      setRunTestsPageRecap,
      setFlowPage,
      setTestsStartedPage,
      setCongratPage,
      runAccomplishAndShowCongratPage,
      handleCourseClick,
      loadCourse,
      getRandomTasksForChamp,
      updateChampPoins,
      runChamp,
    },
    appState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
