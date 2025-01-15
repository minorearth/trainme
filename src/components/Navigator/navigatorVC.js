import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  persistState,
  loadStatePersisted,
  updateStateLS,
} from "@/db/localstorage";
// import { auth } from "@/db/domain/firebaseapp";
import { getAuth } from "firebase/auth";
import user from "@/store/user";
import { getTests, setFlowNodes, getTestsRecap } from "./navigatorVM";
import { getUseMetaData } from "@/db/SA/firebaseSA";

// import { saveChapterCompleted } from "@/db/domain";

import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { setUseMetaData } from "@/db/SA/firebaseSA";
import { getTargetsBySource } from "./utils";

const useNavigator = () => {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [navState, setNavState] = useState();
  const [flow, setFlow] = useState();

  const initialState = {
    page: "flow",
    chapter: -1,
    taskId: 0,
    // nextchapters: [],
    recapTasks: [],
    taskstage: "",
    pts: 0,
  };

  const reLoadFlow = async () => {
    const userProgress = await getUseMetaData(user.userid);
    console.log("userProgress", userProgress);
    setFlowNodes({ progress: userProgress, setFlow, setTestsStartedPage });
    const statePers = updateStateLS({
      ...initialState,
      userProgress: {
        unlocked: userProgress.unlocked,
        completed: userProgress.completed,
        lastunlocked: userProgress.lastunlocked,
      },
      uid: user.userid,
    });
    setNavState(statePers);
    return statePers;
  };
  useEffect(() => {
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
        } else {
          setTests(tasks);
        }
      }
      setLoading(false);
    };
    doLoad();
  }, [user]);

  const setTestsStartedPage = async (chapter) => {
    setNavState((state) => {
      const newState = {
        ...state,
        chapter,
        page: "testsStarted",
        taskId: 0,
        recapTasks: [],
        // nextchapters,
        taskstage: "WIP",
      };
      persistState(newState);
      return newState;
    });
    const tasks = await getTests(chapter);
    setTests(tasks);
  };

  const setRunTestsPage = () => {
    setNavState((state) => {
      const newState = { ...state, page: "testrun" };
      persistState({ ...state, page: "testrun" });
      return newState;
    });
  };

  const setRunTestsPageRecap = (recapTasks) => {
    setNavState((state) => {
      const newState = { ...state, taskstage: "recap", taskId: 0 };
      persistState(newState);
      return newState;
    });
    setTests(getTestsRecap(navState.chapter, recapTasks, tests));
  };

  const setCongratPage = () => {
    setTests([]);
    setNavState((state) => {
      const newState = {
        ...state,
        taskstage: "WIP",
        page: "congrat",
        pts: 0,
      };
      persistState(newState);
      return newState;
    });
  };

  const setTestInterrupted = () => {
    setNavState((state) => {
      const newState = { ...state, page: "flow", taskstage: "" };
      persistState(newState);
      return newState;
    });
  };

  const setTestAccomplished = () => {
    setNavState((state) => {
      const newState = { ...state, page: "flow" };
      persistState(newState);
      return newState;
    });
  };

  const changeState = ({ data }) => {
    setNavState((state) => {
      const newState = { ...state, ...data };
      persistState(newState);
      return newState;
    });
  };

  const changeStateNoEffect = (data) => {
    const state = loadStatePersisted();
    persistState({ ...state, ...data });
  };

  const runAccomplish = async (pts) => {
    const state = loadStatePersisted();
    const lastcompleted = navState.chapter;
    if (lastcompleted != "") {
      const unlocked = getTargetsBySource(lastcompleted, flow.edges);
      await setUseMetaData(
        encrypt2({
          lastcompleted,
          unlocked,
          pts,
          uid: user.userid,
        })
      );
      await reLoadFlow();
    }
    setCongratPage({});
  };

  return {
    actions: {
      setRunTestsPage,
      changeState,
      changeStateNoEffect,
      setRunTestsPageRecap,
      setTestAccomplished,
      setTestInterrupted,
      setTestsStartedPage,
      setCongratPage,
      runAccomplish,
    },
    navState,
    loading,
    tests,
    userid,
    flow,
  };
};

export default useNavigator;
