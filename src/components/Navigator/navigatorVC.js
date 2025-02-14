import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect } from "react";
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

const useNavigator = (fit) => {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [navState, setNavState] = useState();
  const [flow, setFlow] = useState();

  const initialState = {
    page: "flow",
    chapter: -1,
    taskId: 0,
    recapTasks: [],
    taskstage: "",
    pts: 0,
  };

  const reLoadFlow = async () => {
    const userProgress = await getUseMetaData(user.userid);
    const state = loadStatePersisted();

    setFlowNodes({
      progress: userProgress,
      setFlow,
      setTestsStartedPage,
      reLoadFlow,
    });
    const statePers = updateStateLS({
      ...initialState,
      ...state,
      userProgress,
      uid: user.userid,
    });
    setNavState(statePers);
    return statePers;
  };

  useEffect(() => {
    document.addEventListener("copy", (e) => {
      e.clipboardData.setData("text/plain", "No Copying!");
      e.preventDefault();
    });

    const doLoad = async () => {
      const statePers = await reLoadFlow();

      if (statePers.chapter != -1) {
        const tasks = await getTests(statePers.chapter);
        if (
          statePers.taskstage == "recap" ||
          statePers.taskstage == "accomplished_suspended"
        ) {
          setTests(
            getTestsRecap(statePers.chapter, statePers.recapTasks, tasks)
          );
        } else if (statePers.taskstage == "textbook") {
          changeState({ data: initialState });
        } else {
          setTests(tasks);
        }
      }
      setLoading(false);
      progressStore.setCloseProgress();
    };
    doLoad();
  }, [user]);

  const changeState = ({ data }) => {
    setNavState((state) => {
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
    navState,
  }) => {
    if (textbook) {
      changeState({
        data: {
          chapter,
          page: "testrun",
          pts: 0,
          taskId: 0,
          recapTasks: [],
          taskstage: "textbook",
          repeat,
          overflow,
        },
      });
      const tasks = await getTextBook(chapter, navState);
      setTests(tasks);
    } else {
      changeState({
        data: {
          chapter,
          page: "testsStarted",
          taskId: 0,
          recapTasks: [],
          taskstage: "WIP",
          repeat,
          overflow,
        },
      });
      const tasks = await getTests(chapter);
      setTests(tasks);
    }
  };

  const setRunTestsPageRecap = (recapTasks) => {
    changeState({ data: { taskstage: "recap", taskId: 0 } });
    setTests(getTestsRecap(navState.chapter, recapTasks, tests));
  };

  const setCongratPage = (pts) => {
    changeState({ data: { page: "congrat", pts } });
  };

  const setTestInterrupted = () => {
    changeState({ data: { page: "flow", taskstage: "" } });
  };

  const setTestAccomplished = () => {
    changeState({ data: { page: "flow", pts: 0, taskstage: "" } });
    // fit.current();
  };

  const persistStateNoEffect = (data) => {
    const state = loadStatePersisted();
    persistState({ ...state, ...data });
  };

  const runAccomplish = async () => {
    const pts = getSense();
    const unlocked = getTargetsBySource(navState.chapter, flow.edges);
    await setUseMetaData(
      encrypt2({
        lastcompleted: navState.chapter,
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
      reLoadFlow,
    },
    navState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
