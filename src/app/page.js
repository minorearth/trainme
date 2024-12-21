"use client";

import { stn } from "@/constants";
import { chapters } from "@/app/data";
import Box from "@mui/material/Box";
import Chapters from "./chapters/chapters";
import StartnTest from "./hh/[hh]/startnTest";
import { useEffect, useState } from "react";
import { setState, getState } from "@/app/db/localstorage";
import { testsall } from "@/app/data";
import Flow from "./flow/flow";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

  const [nav, setNav] = useState({
    testsStarted: false,
    inProgress: false,
    chapter: -1,
    taskId: 0,
  });

  const getTests = (chapter) => {
    const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
    return filteredTasks;
  };

  useEffect(() => {
    let statePers = JSON.parse(getState());
    if (!statePers) {
      setState(
        JSON.stringify({
          testsStarted: false,
          inProgress: false,
          chapter: -1,
          taskId: 0,
        })
      );
      statePers = JSON.parse(getState());
    }

    setNav({
      testsStarted: statePers.testsStarted,
      chapter: statePers.chapter,
      inProgress: statePers.inProgress,
      taskId: statePers.taskId,
    });

    if (statePers.chapter != -1) {
      setTests(getTests(statePers.chapter));
    }
    setLoading(false);
  }, []);

  const setTestsStarted = (chapter) => {
    setNav((state) => ({ ...state, chapter, testsStarted: true }));
    const state = JSON.parse(getState());
    setState(JSON.stringify({ ...state, chapter, testsStarted: true }));
    console.log(getTests(chapter));
    setTests(getTests(chapter));
  };

  const interruptTest = () => {
    setNav((state) => ({
      chapter: -1,
      testsStarted: false,
      inProgress: false,
      taskId: 0,
    }));
    setState(
      JSON.stringify({
        testsStarted: false,
        inProgress: false,
        chapter: -1,
        taskId: 0,
      })
    );
  };

  const setTestsInProgress = () => {
    setNav((state) => ({ ...state, inProgress: true }));
    const state = JSON.parse(getState());
    setState(JSON.stringify({ ...state, inProgress: true }));
  };

  const setTaskInProgress = (task) => {
    setNav((state) => ({ ...state, taskId: task }));
    const state = JSON.parse(getState());
    setState(JSON.stringify({ ...state, taskId: task }));
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
        {!nav.testsStarted && !loading && (
          // <Chapters setTestsStarted={setTestsStarted} />
          <Flow setTestsStarted={setTestsStarted} userid={userid} />
        )}
        {nav.testsStarted && !loading && (
          <StartnTest
            nav={nav}
            setTestsInProgress={setTestsInProgress}
            tests={tests}
            setTaskInProgress={setTaskInProgress}
            interruptTest={interruptTest}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
