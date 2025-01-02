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
import { getLinks } from "@/db/firebase";

const Navigator = observer(() => {
  useEffect(() => {
    const zu = async () => {
      const res = await getLinks();
      console.log(res);
    };
    zu();
  }, []);
  const { actions, navState, loading, tests, userid } = useNavigator();

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

        {navState.page == "flow" && !loading && (
          <ReactFlowProvider>
            <Flow
              setTestsStartedPage={actions.setTestsStartedPage}
              navState={navState}
              userid={userid}
            />
          </ReactFlowProvider>
        )}

        {navState.page == "testsStarted" && (
          <Start setRunTestsPage={actions.setRunTestsPage} />
        )}

        {navState.page == "testrun" && (
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
