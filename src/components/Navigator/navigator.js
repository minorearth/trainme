"use client";
import Box from "@mui/material/Box";
import Course from "@/components/course/course";
import { ReactFlowProvider } from "@xyflow/react";
import CongratPage from "@/components/taskset/congrat";
import Start from "@/components/taskset/start";
import Task from "@/components/taskset/taskrun/task";
import useApp from "./hooks/loadApp";
import Progress from "@/components/common/splash/progressdots/progressdots";
import AlertDialog from "@/components/common/dialog/dialog";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import AdminPanel from "@/components/admin/adminpanel";
import SplashTimeout from "@/components/common/splash/splashTimeout/splashTimeout";
import SplashAction from "@/components/common/splash/splashAction/splashAction";
import stn from "@/globals/settings";
import usePyodide from "@/components/Navigator/hooks/usePyodide.js";
import Courses from "@/components/courses/courses";
import Champ from "@/components/champ/Champ";
import FloatMenu from "@/components/Navigator/floatMenu";
import Tutorial from "@/components/tutorial/tutorial";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import CountdownCircle from "@/components/common/countdown/CountdownCircle/CountdownCircle";

import TawkToChat from "@/components/common/tawkto/tawkto.js";
import { toJS } from "mobx";

//stores
import navigator from "@/components/Navigator/store/navigator";
import taskset from "@/components/taskset/store/taskset";
import course from "@/components/course/store/course";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import pyodide from "@/components/Navigator/store/pyodide";

const Navigator = observer(() => {
  const [showSplashTimeout, setShowSplashTimeout] = useState(true);
  const { loading } = useApp();
  usePyodide();
  return (
    <Box>
      {(loading || !pyodide.pyodide || showSplashTimeout) && (
        <SplashTimeout action={setShowSplashTimeout} duration={4000} />
      )}
      {/* <TawkToChat /> */}
      {!loading && pyodide.pyodide && !showSplashTimeout && (
        <Box
          id="human"
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          {(navigator.state.page == "courses" ||
            navigator.state.page == "champ") && (
            <>
              <FloatMenu />
              <DLSwitch
                sx={{ position: "absolute", top: "40px", left: "60px" }}
              />
            </>
          )}
          <AlertDialog />
          <Tutorial />
          {countdowncircle.state.visible && <CountdownCircle />}
          {stn.mode.DEV_MODE && <AdminPanel />}
          <Progress />
          <SplashAction name={"ok"} />
          {navigator.state.page == "courses" && <Courses />}

          {navigator.state.page == "champ" && <Champ />}

          {navigator.state.page == "flow" &&
            !!course.flow &&
            course.state.courseid && (
              <ReactFlowProvider>
                <Course />
              </ReactFlowProvider>
            )}

          {navigator.state.page == "lessonStarted" && <Start />}

          {navigator.state.page == "testrun" &&
            taskset.allTasks.length != 0 &&
            pyodide.pyodide && <Task />}

          {navigator.state.page == "congrat" && <CongratPage />}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
