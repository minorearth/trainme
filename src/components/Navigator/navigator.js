"use client";
import Box from "@mui/material/Box";
import Flow from "../flow/flow";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactFlowProvider } from "@xyflow/react";
import Congrat from "@/components/test/congrat/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/testrun/test";
import useNavigator from "./navigatorVC";
import Progress from "@/components/common/progress";
import AlertDialog from "@/components/common/dialog/dialog";
import { observer } from "mobx-react-lite";
import Countdown from "../common/countdown/countdown";
import countdown from "@/store/cowntdown";
import { useEffect, useRef } from "react";
import progress from "@/store/progress";
import AdminPanel from "@/components/admin/adminpanel";

import stn from "@/globals/settings";

const Navigator = observer(() => {
  const fit = useRef();
  const { actions, navState, loading, tests, userid, flow } = useNavigator(fit);

  return !navState ? (
    <Progress open={true} />
  ) : (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <Progress open={progress.showProgress} />
      {countdown.dialogState.visible && <Countdown />}
      <AlertDialog />
      {stn.mode.DEV_MODE && <AdminPanel flow={flow} />}

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
        <Test nav={navState} tests={tests} actions={actions} />
      )}

      {navState.page == "congrat" && (
        <Congrat
          setTestAccomplished={actions.setTestAccomplished}
          nav={navState}
          actions={actions}
        />
      )}
    </Box>
  );
});

export default Navigator;
