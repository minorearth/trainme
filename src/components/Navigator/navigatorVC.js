import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  persistState as persistState,
  loadStatePersisted,
} from "@/db/localstorage";
import { testsall } from "@/db/data";

const useNavigator = () => {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);

  const [navState, setNavState] = useState();

  //   const [navState, setNavState] = useState({
  //     page: "flow",
  //     chapter: -1,
  //     taskId: 0,
  //     unlockedtoshow: [],
  //   });

  const getTests = (chapter) => {
    const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
    return filteredTasks;
  };

  const getTestsRecap = (chapter, recapTasks) => {
    const filteredTasks = testsall
      .filter((test) => test.chapterid == chapter)
      .filter((test, id) => recapTasks.includes(id));
    return filteredTasks;
  };

  const initialState = {
    page: "flow",
    chapter: -1,
    taskId: 0,
    unlockedtoshow: ["1"],
    recapTasks: [],
    recap: false,
  };

  useLayoutEffect(() => {
    let statePers = JSON.parse(loadStatePersisted());
    if (!statePers) {
      persistState(JSON.stringify(initialState));
      statePers = JSON.parse(loadStatePersisted());
    }

    setNavState(statePers);

    if (statePers.chapter != -1) {
      statePers.recap
        ? setTests(getTestsRecap(statePers.chapter, statePers.recapTasks))
        : setTests(getTests(statePers.chapter));
    }
    setLoading(false);
  }, []);

  const setTestsStartedPage = (chapter) => {
    setNavState((state) => {
      const newState = {
        ...state,
        chapter,
        page: "testsStarted",
        taskId: 0,
        recapTasks: [],
      };
      persistState(JSON.stringify(newState));
      return newState;
    });
    setTests(getTests(chapter));
  };

  const setRunTestsPage = () => {
    setNavState((state) => {
      const newState = { ...state, page: "testrun" };
      persistState(JSON.stringify({ ...state, page: "testrun" }));
      return newState;
    });
    // const state = JSON.parse(loadStatePersisted());
  };

  const setRunTestsPageRecap = (recapTasks) => {
    setNavState((state) => {
      const newState = { ...state, recap: true, taskId: 0 };
      persistState(JSON.stringify(newState));
      return newState;
    });
    setTests(getTestsRecap(navState.chapter, recapTasks));

    // const state = JSON.parse(loadStatePersisted());
  };

  const setCongratPage = ({ unlockedtoshow, lastcompleted }) => {
    setNavState((state) => {
      const newState = {
        ...state,
        unlockedtoshow,
        lastcompleted,
        recap: false,
        page: "congrat",
      };
      persistState(JSON.stringify(newState));
      return newState;
    });
  };

  const setTestInterrupted = () => {
    setNavState((state) => {
      const newState = { ...state, page: "flow" };
      persistState(JSON.stringify(newState));
      return newState;
    });
  };

  const setTestAccomplished = () => {
    setNavState((state) => {
      const newState = { ...state, page: "flow" };
      persistState(JSON.stringify(newState));
      return newState;
    });
    // const state = JSON.parse(loadStatePersisted());
  };

  const setTaskInProgress = (taskId) => {
    setNavState((state) => {
      const newState = { ...state, taskId };
      persistState(JSON.stringify(newState));
      return newState;
    });
    // const state = JSON.parse(loadStatePersisted());
  };

  const addRecapTask = (taskId) => {
    setNavState((state) => {
      const newState = { ...state, recapTasks: [...state.recapTasks, taskId] };
      persistState(JSON.stringify(newState));
      return newState;
    });
    // const state = JSON.parse(loadStatePersisted());
  };

  const setTaskInProgressNoEffect = (data) => {
    const state = JSON.parse(loadStatePersisted());
    persistState(JSON.stringify({ ...state, ...data }));
  };

  return {
    actions: {
      setRunTestsPage,
      setTaskInProgress,
      setTaskInProgressNoEffect,
      setRunTestsPageRecap,
      setTestAccomplished,
      setTestInterrupted,
      setTestsStartedPage,
      setCongratPage,
      addRecapTask,
    },
    navState,
    loading,
    tests,
    userid,
  };
};

export default useNavigator;
