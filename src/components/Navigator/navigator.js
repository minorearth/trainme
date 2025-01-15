"use client";
import Box from "@mui/material/Box";
import Flow from "../flow/flow";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactFlowProvider } from "@xyflow/react";
import Congrat from "@/components/test/congrat/congrat";
import Start from "@/components/test/start";
import Test from "@/components/test/testrun/test";
import useNavigator from "./navigatorVC";
import Progress from "@/components/common/progress";
import AlertDialog from "@/components/common/dialog";
import { observer } from "mobx-react-lite";
import Countdown from "../common/countdown/countdown";
import countdown from "@/store/cowntdown";
import { useEffect } from "react";
import { setUseMetaData } from "@/db/SA/firebaseSA";
import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

const Navigator = observer(() => {
  const { actions, navState, loading, tests, userid, flow } = useNavigator();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: { default: "#1E1E1E", paper: "#1E1E1E" },
    },
    colorSchemes: {
      dark: true,
    },
  });

  return !navState ? (
    <Progress open={true} />
  ) : (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
        }}
      >
        <AlertDialog />
        {countdown.dialogState.visible && <Countdown />}

        {navState.page == "flow" && !loading && !!flow && (
          <ReactFlowProvider>
            <Flow
              setTestsStartedPage={actions.setTestsStartedPage}
              navState={navState}
              flow={flow}
            />
          </ReactFlowProvider>
        )}

        {navState.page == "testsStarted" && !loading && (
          <Start setRunTestsPage={actions.setRunTestsPage} />
        )}

        {navState.page == "testrun" && tests?.length != 0 && (
          <Test nav={navState} tests={tests} actions={actions} />
        )}

        {navState.page == "congrat" && (
          <Congrat setTestAccomplished={actions.setTestAccomplished} />
        )}
      </Box>
    </ThemeProvider>
  );
});

export default Navigator;
