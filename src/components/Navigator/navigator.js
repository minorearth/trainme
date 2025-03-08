"use client";
import Box from "@mui/material/Box";
import Flow from "../flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import Congrat from "@/components/test/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/testrun/test";
import useNavigator from "./navigatorVC";
import Progress from "@/components/common/progress/progress";
import AlertDialog from "@/components/common/dialog/dialog";
import { observer } from "mobx-react-lite";
import Countdown from "../common/countdown/CountdownCircle";
import countdown from "@/store/cowntdown";
import { useEffect, useRef, useState } from "react";
import AdminPanel from "@/components/admin/adminpanel";
import SplashTimeout from "@/components/common/splashTimeout/splashTimeout";
import SplashAction from "@/components/common/splashAction/splashAction";
import stn from "@/globals/settings";
import usePyodide from "@/components/Navigator/usePyodide.js";
import Courses from "../courses/courses";

const Navigator = observer(() => {
  const [showSplashTimeout, setShowSplashTimeout] = useState(true);
  const { actions, appState, loading, tests, userid, flow } = useNavigator();
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
          {countdown.dialogState.visible && <Countdown />}
          <AlertDialog />
          {stn.mode.DEV_MODE && <AdminPanel flow={flow} />}
          <Progress />
          <SplashAction name={"ok"} />
          {appState.launchedCourse == "" && (
            <Courses showCourse={actions.loadCourse} />
          )}

          {appState.page == "flow" &&
            !loading &&
            !!flow &&
            appState.launchedCourse && (
              <ReactFlowProvider>
                <Flow
                  setTestsStartedPage={actions.setTestsStartedPage}
                  appState={appState}
                  actions={actions}
                  flow={flow}
                />
              </ReactFlowProvider>
            )}

          {appState.page == "testsStarted" && !loading && (
            <Start actions={actions} appState={appState} />
          )}

          {appState.page == "testrun" && tests?.length != 0 && (
            <Test
              appState={appState}
              tests={tests}
              actions={actions}
              pyodide={pyodide2}
            />
          )}

          {appState.page == "congrat" && (
            <Congrat
              setTestAccomplished={actions.setTestAccomplished}
              appState={appState}
              actions={actions}
            />
          )}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
