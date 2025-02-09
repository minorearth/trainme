"use client";
import Box from "@mui/material/Box";
import Flow from "../flow/flow";
import { ReactFlowProvider } from "@xyflow/react";
import Congrat from "@/components/test/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/testrun/Test";
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

const Navigator = observer(() => {
  const fit = useRef();
  const [showSplashTimeout, setShowSplashTimeout] = useState(true);
  const { actions, navState, loading, tests, userid, flow } = useNavigator(fit);
  const { pyodide2 } = usePyodide();

  return (
    <Box>
      {(loading || !pyodide2 || showSplashTimeout) && (
        <SplashTimeout
          action={setShowSplashTimeout}
          duration={400}
          navState={navState}
        />
      )}
      {!loading && pyodide2 && !showSplashTimeout && (
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
          <SplashAction name={"ok"} />
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
