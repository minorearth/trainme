import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  persistState,
  loadStatePersisted,
  updateState,
} from "@/db/localstorage";
// import { auth } from "@/db/domain/firebaseapp";
import { getAuth } from "firebase/auth";
import user from "@/store/user";

// import { testsall } from "@/app/admin/adminUtils/tasksData";
import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

const useNavigator = () => {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [navState, setNavState] = useState();

  const getTests = async (chapter) => {
    //local, do not remove
    // const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
    const filteredTasks = await getDocDataFromCollectionByIdClient(
      "tasks",
      chapter
    );
    return filteredTasks.data.tasks;
  };

  const getTestsRecap = (chapter, recapTasks, tasks) => {
    const filteredTasks = tasks
      .filter((test) => test.chapterid == chapter)
      .filter((test, id) => recapTasks.includes(id));
    return filteredTasks;
  };

  const initialState = {
    page: "flow",
    chapter: -1,
    taskId: 0,
    nextchapters: [],
    unlockedtoshow: stn.INITIAL_UNLOCKED,
    recapTasks: [],
    taskstage: "",
  };

  useEffect(() => {
    const doLoad = async () => {
      let statePers = loadStatePersisted();
      if (!statePers) {
        persistState(initialState);
        statePers = loadStatePersisted();
      }
      // updateState({ uid: user.userid });
      setNavState(statePers);

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

  const setTestsStartedPage = async (chapter, nextchapters) => {
    setNavState((state) => {
      const newState = {
        ...state,
        chapter,
        page: "testsStarted",
        taskId: 0,
        recapTasks: [],
        nextchapters,
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

  const setCongratPage = ({ unlockedtoshow, lastcompleted }) => {
    setTests([]);
    setNavState((state) => {
      const newState = {
        ...state,
        unlockedtoshow,
        lastcompleted,
        taskstage: "WIP",
        page: "congrat",
      };
      persistState(newState);
      return newState;
    });
  };

  const setTestInterrupted = () => {
    setTests([]);
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
    },
    navState,
    loading,
    tests,
    userid,
  };
};

export default useNavigator;
