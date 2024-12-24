"use client";

import { stn } from "@/constants";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { saveState, loadStatePersisted } from "@/app/db/localstorage";
import { testsall } from "@/app/data";
import Flow from "./flow/flow";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactFlowProvider } from "@xyflow/react";
import Congrat from "@/components/test/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/test";

export default function Page({ params }) {
  const userid = "1";
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: { default: "#1E1E1E", paper: "#1E1E1E" },
    },
    colorSchemes: {
      dark: true,
    },
  });

  const [navState, setNavState] = useState({
    page: "flow",
    chapter: -1,
    taskId: 0,
  });

  const getTests = (chapter) => {
    const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
    return filteredTasks;
  };

  useEffect(() => {
    let statePers = JSON.parse(loadStatePersisted());
    if (!statePers) {
      saveState(
        JSON.stringify({
          page: "flow",
          chapter: -1,
          taskId: 0,
        })
      );
      statePers = JSON.parse(loadStatePersisted());
    }

    setNavState(statePers);

    if (statePers.chapter != -1) {
      setTests(getTests(statePers.chapter));
    }
    setLoading(false);
  }, []);

  const setTestsStarted = (chapter) => {
    const appState = {
      page: "testsStarted",
      chapter,
      taskId: 0,
    };
    setNavState(appState);
    // const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify(appState));
    setTests(getTests(chapter));
  };

  const setCongrat = (chapter) => {
    const appState = {
      page: "congrat",
      chapter: -1,
      taskId: 0,
    };
    setNavState(appState);
    const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify(appState));
  };

  const interruptTest = () => {
    const appState = {
      page: "flow",
      chapter: -1,
      taskId: 0,
    };
    setNavState((state) => appState);
    saveState(JSON.stringify(appState));
  };

  const setTestsInProgress = () => {
    setNavState((state) => ({ ...state, page: "testinprogress" }));
    const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify({ ...state, page: "testinprogress" }));
  };

  const setTaskInProgress = (task) => {
    setNavState((state) => ({ ...state, taskId: task }));
    const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify({ ...state, taskId: task }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
        }}
      >
        {navState.page == "flow" && !loading && (
          // <Chapters setTestsStarted={setTestsStarted} />
          <ReactFlowProvider>
            <Flow setTestsStarted={setTestsStarted} userid={userid} />
          </ReactFlowProvider>
        )}

        {navState.page == "testsStarted" && (
          <Start setTestsStarted={setTestsInProgress} />
        )}

        {navState.page == "testinprogress" && (
          <Test
            nav={navState}
            tests={tests}
            setTaskInProgress={setTaskInProgress}
            interruptTest={interruptTest}
            setCongrat={setCongrat}
          />
        )}

        {navState.page == "congrat" && <Congrat action={interruptTest} />}
      </Box>
    </ThemeProvider>
  );
}
