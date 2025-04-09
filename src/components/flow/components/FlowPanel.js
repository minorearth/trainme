// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React from "react";
import { Panel } from "@xyflow/react";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import "@xyflow/react/dist/base.css";
import { BiCoinStack } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import Fab from "@mui/material/Fab";
import Animation from "@/components/common/animation/Animation";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const IconButtonNoRipple = ({ children }) => {
  return (
    <IconButton
      disableRipple
      sx={{
        color: "inherit",
        "&:hover": {
          // backgroundColor: "transparent",
          opacity: 0.7,
        },
        "&:active": {
          // backgroundColor: "transparent",
          opacity: 0.9,
        },
      }}
    >
      {children}
    </IconButton>
  );
};

const FlowPanel = ({ appState, actionsNAV }) => {
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
          alignItems: "center",
        }}
      >
        <IconButtonNoRipple>
          <HomeIcon
            sx={{ fontSize: "60px" }}
            onClick={() => {
              actionsNAV.openAllCoursePage();
            }}
          />
        </IconButtonNoRipple>

        {/* <Animation
          height={"60px"}
          width={"60px"}
          name={"home"}
          onClick={() => {
            actionsNAV.openAllCoursePage();
          }}
        /> */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            // padding: "4px",
            alignItems: "center",
          }}
        >
          <BiCoinStack size={"60px"} />
          <Typography variant="h4">{appState.userProgress.rating}</Typography>
        </Box>

        <IconButtonNoRipple>
          <ImportContactsOutlinedIcon
            sx={{ fontSize: "60px" }}
            onClick={async () => {
              actionsNAV.openTestsStartedPage({
                nodemode: "textbook",
                courseid: appState.launchedCourse,
              });
            }}
          />
        </IconButtonNoRipple>

        {/* <Animation
          id="textbook"
          height={"60px"}
          width={"60px"}
          name={"book"}
          onClick={async () => {
            actionsNAV.openTestsStartedPage({
              nodemode: "textbook",
              courseid: appState.launchedCourse,
            });
          }}
        /> */}

        <IconButtonNoRipple>
          <SupportAgentIcon
            sx={{ fontSize: "60px" }}
            onClick={() => {
              actionsNAV.openSupportPage();
            }}
          />
        </IconButtonNoRipple>
        <IconButtonNoRipple>
          <LightbulbIcon
            sx={{ fontSize: "60px" }}
            onClick={() => {
              actionsNAV.openTutorial();
            }}
          />
        </IconButtonNoRipple>
        <DLSwitch />
      </Paper>
    </Panel>
  );
};

export default FlowPanel;
