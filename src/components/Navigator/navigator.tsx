"use client";
//common
import { observer } from "mobx-react-lite";
import stn from "@/globals/settings";
import { toJS } from "mobx";

//react stuff
import Box from "@mui/material/Box";
import { ReactFlowProvider } from "@xyflow/react";

//hooks
import useApp from "./hooks/loadApp";
import usePyodide from "@/components/pyodide/usePyodide";

//stores

//components
import Start from "@/components/taskset/start";
import Taskrun from "@/components/taskset/taskrun/Taskrun";
import Course from "@/components/course/course";
import CongratPage from "@/components/taskset/congrat";
import Splash from "@/components/common/splash/splash";
import AlertDialog from "@/components/common/dialog/dialog";
import AdminPanel from "@/components/adminpanel/adminpanel";
import Courses from "@/components/courses/courses";
import Champ from "@/components/champ/Champ";
import FloatMenu from "@/components/Navigator/floatMenu";
import Tutorial from "@/components/tutorial/tutorial";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import TawkToChat from "@/components/common/tawkto/tawkto.js";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";

const Navigator = observer(() => {
  useApp();
  usePyodide();
  return (
    <Box>
      <Splash />
      <AlertDialog />
      <Tutorial />
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

          {stn.mode.DEV_MODE &&
            (navigator.state.page == "testrun" ||
              navigator.state.page == "flow") && <AdminPanel />}
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
