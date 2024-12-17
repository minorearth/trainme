"use client";

import { stn } from "@/constants";
import { chapters } from "@/app/data";
import Box from "@mui/material/Box";
import Chapters from "./chapters/chapters";
import StartnTest from "./hh/[hh]/startnTest";
import { useEffect, useState } from "react";
import { setState, getState } from "@/app/db/localstorage";
import { testsall } from "@/app/data";

export default function Test({ params }) {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);

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
    setTests(getTests(chapter));
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
    <Box
      sx={{
        width: "100%",
        height: "auto",
      }}
    >
      {!nav.testsStarted && !loading && (
        <Chapters setTestsStarted={setTestsStarted} />
      )}
      {nav.testsStarted && !loading && (
        <StartnTest
          nav={nav}
          setTestsInProgress={setTestsInProgress}
          tests={tests}
          setTaskInProgress={setTaskInProgress}
        />
      )}
    </Box>
  );
}
