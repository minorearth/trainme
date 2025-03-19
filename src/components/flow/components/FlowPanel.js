// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React from "react";
import { Panel } from "@xyflow/react";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

import "@xyflow/react/dist/base.css";
import { BiCoinStack } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { signOutUserClient } from "@/db/domain/domain";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import Fab from "@mui/material/Fab";
import Animation from "@/components/common/animation/Animation";

const FlowPanel = ({ appState, actions }) => {

  return (
    <Panel position="top-left" style={{ width: "97%" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          padding: "4px",
          justifyContent: "space-evenly",
        }}
      >
        <DLSwitch />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "4px",
          }}
        >
          <BiCoinStack size={"40px"} />
          <Typography variant="h4" gutterBottom>
            {appState.userProgress.rating}
          </Typography>
        </Box>
        <Animation
          id="textbook"
          height={"60px"}
          width={"60px"}
          name={"book"}
          onClick={async () => {
            actions.openTestsStartedPage({
              nodemode: "textbook",
              courseid: appState.launchedCourse,
            });
          }}
        />

        <Animation
          height={"60px"}
          width={"60px"}
          name={"home"}
          onClick={() => {
            actions.openAllCoursePage();

            // await signOutUserClient();
            // router.push(`/login/`);
          }}
        />
      </Paper>
    </Panel>
  );
};

export default FlowPanel;
