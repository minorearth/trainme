"use client";

import { stn } from "@/constants";
import { chapters } from "@/app/data";
import Box from "@mui/material/Box";
import Chapters from "./chapters/chapters";
import StartnTest from "../components/test/startnTest";
import { useEffect, useState } from "react";
import { saveState, loadStatePersisted } from "@/app/db/localstorage";
import { testsall } from "@/app/data";
import Flow from "./flow/flow";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactFlowProvider } from "@xyflow/react";

export default function Test({ params }) {
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
    testsStarted: false,
    inProgress: false,
    congrat: false,
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
          testsStarted: false,
          inProgress: false,
          congrat: false,
          chapter: -1,
          taskId: 0,
        })
      );
      statePers = JSON.parse(loadStatePersisted());
    }

    setNavState({
      testsStarted: statePers.testsStarted,
      chapter: statePers.chapter,
      inProgress: statePers.inProgress,
      taskId: statePers.taskId,
      congrat: statePers.congrat,
    });

    if (statePers.chapter != -1) {
      setTests(getTests(statePers.chapter));
    }
    setLoading(false);
  }, []);

  const setTestsStarted = (chapter) => {
    setNavState((state) => ({ ...state, chapter, testsStarted: true }));
    const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify({ ...state, chapter, testsStarted: true }));
    setTests(getTests(chapter));
  };

  const setCongrat = (chapter) => {
    setNavState((state) => ({ ...state, testsStarted: false, congrat: true }));
    const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify({ ...state, testsStarted: false, congrat: true }));
  };

  const interruptTest = () => {
    setNavState((state) => ({
      testsStarted: false,
      inProgress: false,
      congrat: false,
      chapter: -1,
      taskId: 0,
    }));
    saveState(
      JSON.stringify({
        testsStarted: false,
        inProgress: false,
        congrat: false,
        chapter: -1,
        taskId: 0,
      })
    );
  };

  const setTestsInProgress = () => {
    setNavState((state) => ({ ...state, inProgress: true }));
    const state = JSON.parse(loadStatePersisted());
    saveState(JSON.stringify({ ...state, inProgress: true }));
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
        {!navState.testsStarted && !navState.congrat && !loading && (
          // <Chapters setTestsStarted={setTestsStarted} />
          <ReactFlowProvider>
            <Flow setTestsStarted={setTestsStarted} userid={userid} />
          </ReactFlowProvider>
        )}
        {navState.testsStarted && !loading && (
          <StartnTest
            navState={navState}
            setTestsInProgress={setTestsInProgress}
            tests={tests}
            setTaskInProgress={setTaskInProgress}
            interruptTest={interruptTest}
            setCongrat={setCongrat}
          />
        )}
        {/* {navState.congrat && !loading && <Congrat action={interruptTest} />} */}
      </Box>
    </ThemeProvider>
  );
}
