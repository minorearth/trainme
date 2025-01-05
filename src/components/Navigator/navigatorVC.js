import { stn } from "@/constants";
import { useEffect, useState, useLayoutEffect } from "react";
import {
  persistState as persistState,
  loadStatePersisted,
} from "@/db/localstorage";
import { testsall } from "@/app/admin/adminUtils/tasksData";
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
    unlockedtoshow: ["34cb6e1f-52b5-4d97-a2e6-68222e8766c1"],
    recapTasks: [],
    taskstage: "",
  };

  useLayoutEffect(() => {
    const doLoad = async () => {
      let statePers = JSON.parse(loadStatePersisted());
      if (!statePers) {
        persistState(JSON.stringify(initialState));
        statePers = JSON.parse(loadStatePersisted());
      }

      setNavState(statePers);

      if (statePers.chapter != -1) {
        const tasks = await getTests(statePers.chapter);
        if (
          statePers.taskstage == "recap" ||
          statePers.taskstage == "accomplished"
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
  }, []);

  const setTestsStartedPage = async (chapter, nextchapters) => {
    setNavState((state) => {
      const newState = {
        ...state,
        chapter,
        page: "testsStarted",
        taskId: 0,
        recapTasks: [],
        nextchapters,
      };
      persistState(JSON.stringify(newState));
      return newState;
    });
    const tasks = await getTests(chapter);
    setTests(tasks);
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
      const newState = { ...state, taskstage: "recap", taskId: 0 };
      persistState(JSON.stringify(newState));
      return newState;
    });
    setTests(getTestsRecap(navState.chapter, recapTasks, tests));

    // const state = JSON.parse(loadStatePersisted());
  };

  const setCongratPage = ({ unlockedtoshow, lastcompleted }) => {
    setTests([]);
    setNavState((state) => {
      const newState = {
        ...state,
        unlockedtoshow,
        lastcompleted,
        taskstage: "",
        page: "congrat",
      };
      persistState(JSON.stringify(newState));
      return newState;
    });
  };

  const setTestInterrupted = () => {
    setTests([]);
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

  const changeState = ({ data }) => {
    setNavState((state) => {
      const newState = { ...state, ...data };
      persistState(JSON.stringify(newState));
      return newState;
    });
    // const state = JSON.parse(loadStatePersisted());
  };

  const addRecapTask = ({ taskId, nextTaskId }) => {
    // setNavState((state) => {

    const state = JSON.parse(loadStatePersisted());
    navState.recapTasks = [...state.recapTasks, taskId];
    navState.taskId = taskId;

    const newState = {
      ...state,
      taskId: nextTaskId,
      recapTasks: [...state.recapTasks, taskId],
    };
    persistState(JSON.stringify(newState));
    // return newState;
    // });
    // const state = JSON.parse(loadStatePersisted());
  };

  const changeStateNoEffect = (data) => {
    const state = JSON.parse(loadStatePersisted());
    persistState(JSON.stringify({ ...state, ...data }));
  };

  // const setNextChaptersNoEffect = (data) => {
  //   const state = JSON.parse(loadStatePersisted());
  //   console.log("zu", { ...state, ...data });
  //   persistState("sdad");
  // };

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
      addRecapTask,
      // setNextChaptersNoEffect,
    },
    navState,
    loading,
    tests,
    userid,
  };
};

export default useNavigator;
