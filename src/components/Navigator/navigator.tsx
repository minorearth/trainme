"use client";
//common
import { observer } from "mobx-react-lite";
import S from "@/globals/settings";
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
import taskset from "@/components/taskset/layers/store/taskset";
import { PG, ST } from "@/T/typesBasic";

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
          {(navigator.state.page == PG.courses ||
            navigator.state.page == PG.champ) && (
            <>
              <FloatMenu />
              <DLSwitch
                sx={{ position: "absolute", top: "40px", left: "60px" }}
              />
            </>
          )}

          {S.mode.DEV_MODE &&
            (navigator.state.page == PG.testrun ||
              navigator.state.page == PG.flow) && <AdminPanel />}
          {navigator.state.page == PG.courses && <Courses />}
          {navigator.state.page == PG.champ && <Champ />}
          {navigator.state.page == PG.flow && !!course.flow && (
            <ReactFlowProvider>
              <Course />
            </ReactFlowProvider>
          )}
          {navigator.state.page == PG.lessonStarted && <Start />}
          {navigator.state.page == PG.testrun && <Taskrun />}
          {navigator.state.page == PG.congrat &&
            taskset.state.success != ST.undefined && <CongratPage />}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
