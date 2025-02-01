"use client";
import Box from "@mui/material/Box";
import Flow from "../flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import Congrat from "@/components/test/congrat/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/testrun/test";
import useNavigator from "./navigatorVC";
import Progress from "@/components/common/progress/progress";
import AlertDialog from "@/components/common/dialog/dialog";
import { observer } from "mobx-react-lite";
import Countdown from "../common/countdown/countdown";
import countdown from "@/store/cowntdown";
import { useEffect, useRef, useState } from "react";
import progress from "@/components/common/progress/progressStore";
import AdminPanel from "@/components/admin/adminpanel";
import Splash from "@/components/common/splash/splash";
import { customTheme } from "@/app/theme";
import { ThemeProvider } from "@mui/material/styles";
import SplashCD from "@/components/common/splashCountDown/splashCD";
import stn from "@/globals/settings";
import usePyodide from "@/components/Navigator/usePyodide.js";

const Navigator = observer(() => {
  const fit = useRef();
  const [showSplash, setShowSplash] = useState(true);
  const { actions, navState, loading, tests, userid, flow } = useNavigator(fit);
  const { pyodide2 } = usePyodide();

  return (
    <Box>
      {/* <Box sx={{ backgroundColor: customTheme.palette.background.default }}> */}
      {showSplash && (
        <Splash action={setShowSplash} duration={4000} navState={navState} />
      )}
      {!showSplash && (
        <Box
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          {countdown.dialogState.visible && <Countdown />}
          <AlertDialog />
          {stn.mode.DEV_MODE && <AdminPanel flow={flow} />}
          <Progress />
          <SplashCD />
          {navState.page == "flow" && !loading && !!flow && (
            <ReactFlowProvider>
              <Flow
                setTestsStartedPage={actions.setTestsStartedPage}
                navState={navState}
                flow={flow}
                fit={fit}
              />
            </ReactFlowProvider>
          )}

          {navState.page == "testsStarted" && !loading && (
            <Start actions={actions} nav={navState} />
          )}

          {navState.page == "testrun" && tests?.length != 0 && (
            <Test
              nav={navState}
              tests={tests}
              actions={actions}
              pyodide={pyodide2}
            />
          )}

          {navState.page == "congrat" && (
            <Congrat
              setTestAccomplished={actions.setTestAccomplished}
              nav={navState}
              actions={actions}
            />
          )}
        </Box>
      )}
    </Box>
  );
});

export default Navigator;
