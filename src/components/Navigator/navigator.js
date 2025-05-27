"use client";
import Box from "@mui/material/Box";
import Flow from "../flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import CongratPage from "@/components/test/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/testrun/test";
import useNavigator from "./navigatorVC";
import Progress from "@/components/common/splash/progressdots/progressdots";
import AlertDialog from "@/components/common/dialog/dialog";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import AdminPanel from "@/components/admin/adminpanel";
import SplashTimeout from "@/components/common/splash/splashTimeout/splashTimeout";
import SplashAction from "@/components/common/splash/splashAction/splashAction";
import stn from "@/globals/settings";
import usePyodide from "@/components/Navigator/usePyodide.js";
import Courses from "../courses/courses";
import Champ from "../champ/Champ";
import FloatMenu from "./floatMenu.js";
import Tutorial from "../tutorial/tutorial";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import CountdownCircle from "@/components/common/countdown/CountdownCircle/CountdownCircle";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import { Watcher } from "@/components/Navigator/watcher/watcher";
import TawkToChat from "@/components/common/tawkto/tawkto.js";
import AS from "@/store/appstate";

const Navigator = observer(() => {
  const [showSplashTimeout, setShowSplashTimeout] = useState(true);
  const { actionsNAV, loading, tasks, flow } = useNavigator();
  const { pyodide2 } = usePyodide();

  return (
    <Box>
      {(loading || !pyodide2 || showSplashTimeout) && (
        <SplashTimeout action={setShowSplashTimeout} duration={4000} />
      )}
      <Watcher />
      <TawkToChat />
      {!loading && pyodide2 && !showSplashTimeout && (
        <Box
          id="human"
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          {(AS.as.page == "courses" || AS.as.page == "champ") && (
            <>
              <FloatMenu
                // state={{ qrVisible, noteVisible }}
                page={AS.as.page}
                actionsNAV={actionsNAV}
              />
              <DLSwitch
                sx={{ position: "absolute", top: "40px", left: "60px" }}
              />
            </>
          )}
          <AlertDialog />
          <Tutorial />
          {countdowncircle.state.visible && <CountdownCircle />}
          {stn.mode.DEV_MODE && (
            <AdminPanel flow={flow} actionsNAV={actionsNAV} tasks={tasks} />
          )}
          <Progress />
          <SplashAction name={"ok"} />
          {AS.as.page == "courses" && <Courses actionsNAV={actionsNAV} />}

          {AS.as.page == "champ" && <Champ actionsNAV={actionsNAV} />}

          {AS.as.page == "flow" &&
            !loading &&
            !!flow &&
            AS.as.launchedCourse && (
              <ReactFlowProvider>
                <Flow actionsNAV={actionsNAV} flow={flow} />
              </ReactFlowProvider>
            )}

          {AS.as.page == "testsStarted" && !loading && (
            <Start actionsNAV={actionsNAV} />
          )}

          {AS.as.page == "testrun" && tasks?.length != 0 && (
            <Test tasks={tasks} actionsNAV={actionsNAV} pyodide={pyodide2} />
          )}

          {AS.as.page == "congrat" && <CongratPage actionsNAV={actionsNAV} />}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
