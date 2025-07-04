"use client";
import Box from "@mui/material/Box";
import Course from "@/components/course/course";
import { ReactFlowProvider } from "@xyflow/react";
import CongratPage from "@/components/taskset/congrat";
import Start from "@/components/taskset/start";
import Taskrun from "@/components/taskset/taskrun/Taskrun";
import useApp from "./hooks/loadApp";
import Splash from "@/components/common/splash/splash";
import AlertDialog from "@/components/common/dialog/dialog";
import { observer } from "mobx-react-lite";
import AdminPanel from "@/components/adminpanel/adminpanel";
import stn from "@/globals/settings";
import usePyodide from "@/components/pyodide/usePyodide.js";
import Courses from "@/components/courses/courses";
import Champ from "@/components/champ/Champ";
import FloatMenu from "@/components/Navigator/floatMenu";
import Tutorial from "@/components/tutorial/tutorial";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import CountdownCircle from "@/components/common/countdown/CountdownCircle/CountdownCircle";

import TawkToChat from "@/components/common/tawkto/tawkto.js";
import { toJS } from "mobx";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";

const Navigator = observer(() => {
  useApp();
  usePyodide();
  return (
    <Box>
      <Splash />
      <AlertDialog />
      <Tutorial />
      <CountdownCircle />
      {/* <TawkToChat /> */}
      {navigator.apploaded && (
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
          {stn.mode.DEV_MODE && <AdminPanel />}
          {navigator.state.page == "courses" && <Courses />}
          {navigator.state.page == "champ" && <Champ />}
          {navigator.state.page == "flow" && !!course.flow && (
            <ReactFlowProvider>
              <Course />
            </ReactFlowProvider>
          )}
          {navigator.state.page == "lessonStarted" && <Start />}
          {navigator.state.page == "testrun" && <Taskrun />}
          {navigator.state.page == "congrat" && <CongratPage />}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
