"use client";
import Box from "@mui/material/Box";
import Course from "../course/course";
import { ReactFlowProvider } from "@xyflow/react";
import CongratPage from "@/components/chapter/congrat";
import Start from "@/components/chapter/start";
import Task from "@/components/chapter/taskrun/task";
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
import Courses from "../courses/courses";
import Champ from "../champ/Champ";
import FloatMenu from "./floatMenu.js";
import Tutorial from "../tutorial/tutorial";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import CountdownCircle from "@/components/common/countdown/CountdownCircle/CountdownCircle";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import { Watcher } from "@/components/Navigator/watcher/watcher";
import TawkToChat from "@/components/common/tawkto/tawkto.js";
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import { toJS } from "mobx";
import flow from "@/components/course/store/course";

const Navigator = observer(() => {
  const [showSplashTimeout, setShowSplashTimeout] = useState(true);
  const { loading } = useApp();
  const { pyodide2 } = usePyodide();
  return (
    <Box>
      {(loading || !pyodide2 || showSplashTimeout) && (
        <SplashTimeout action={setShowSplashTimeout} duration={4000} />
      )}
      <Watcher />
      {/* <TawkToChat /> */}
      {!loading && pyodide2 && !showSplashTimeout && (
        <Box
          id="human"
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          {(navigator.as.page == "courses" || navigator.as.page == "champ") && (
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
          {navigator.as.page == "courses" && <Courses />}

          {navigator.as.page == "champ" && <Champ />}

          {navigator.as.page == "flow" &&
            //TODO: flow.state.courseid
            !!flow.flow &&
            flow.state.courseid && (
              <ReactFlowProvider>
                <Course />
              </ReactFlowProvider>
            )}

          {navigator.as.page == "lessonStarted" && <Start />}

          {navigator.as.page == "testrun" && chapter.allTasks.length != 0 && (
            <Task pyodide={pyodide2} />
          )}

          {navigator.as.page == "congrat" && <CongratPage />}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
