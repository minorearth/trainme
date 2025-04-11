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

const Navigator = observer(() => {
  const [showSplashTimeout, setShowSplashTimeout] = useState(true);
  const { actionsNAV, appState, loading, tests, flow } = useNavigator();
  const { pyodide2 } = usePyodide();

  return (
    <Box>
      {(loading || !pyodide2 || showSplashTimeout) && (
        <SplashTimeout
          action={setShowSplashTimeout}
          duration={4000}
          appState={appState}
        />
      )}
      {!loading && pyodide2 && !showSplashTimeout && (
        <Box
          id="human"
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          {(appState.page == "courses" || appState.page == "champ") && (
            <>
              <FloatMenu
                // state={{ qrVisible, noteVisible }}
                page={appState.page}
                actionsNAV={actionsNAV}
              />
              <DLSwitch
                sx={{ position: "absolute", top: "40px", left: "60px" }}
              />
            </>
          )}
          {/* {countdownbutton.state.visible && <Countdown />} */}
          <AlertDialog />
          <Tutorial />
          {countdowncircle.state.visible && <CountdownCircle />}

          {stn.mode.DEV_MODE && (
            <AdminPanel
              flow={flow}
              appState={appState}
              actionsNAV={actionsNAV}
              tests={tests}
            />
          )}
          <Progress />
          <SplashAction name={"ok"} />
          {appState.page == "courses" && <Courses actionsNAV={actionsNAV} />}

          {appState.page == "champ" && (
            <Champ actionsNAV={actionsNAV} appState={appState} />
          )}

          {appState.page == "flow" &&
            !loading &&
            !!flow &&
            appState.launchedCourse && (
              <ReactFlowProvider>
                <Flow appState={appState} actionsNAV={actionsNAV} flow={flow} />
              </ReactFlowProvider>
            )}

          {appState.page == "testsStarted" && !loading && (
            <Start actionsNAV={actionsNAV} appState={appState} />
          )}

          {appState.page == "testrun" && tests?.length != 0 && (
            <Test
              appState={appState}
              tests={tests}
              actionsNAV={actionsNAV}
              pyodide={pyodide2}
            />
          )}

          {appState.page == "congrat" && (
            <CongratPage appState={appState} actionsNAV={actionsNAV} />
          )}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
