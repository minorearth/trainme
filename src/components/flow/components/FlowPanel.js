// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React from "react";
import { Panel } from "@xyflow/react";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import "@xyflow/react/dist/base.css";
import { BiCoinStack } from "react-icons/bi";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import { Tooltip } from "@mui/material";

const ICON_SIZE = "60px";
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
          <Tooltip title={"Вернуться на главную"}>
            <HomeIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={() => {
                actionsNAV.openAllCoursePage();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            // padding: "4px",
            alignItems: "center",
          }}
        >
          <BiCoinStack size={ICON_SIZE} />
          <Typography variant="h4">{appState.userProgress.rating}</Typography>
        </Box>

        <IconButtonNoRipple>
          <Tooltip title={"Учебник"}>
            <ImportContactsOutlinedIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={async () => {
                actionsNAV.openTestsStartedPage({
                  nodemode: "textbook",
                  courseid: appState.launchedCourse,
                });
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>

        <IconButtonNoRipple>
          <Tooltip title={"Поддержка"}>
            <SupportAgentIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={() => {
                actionsNAV.openSupportPage();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>
        <IconButtonNoRipple>
          <Tooltip title={"Как проходить курс"}>
            <LightbulbIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={() => {
                actionsNAV.openTutorial();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>
        <DLSwitch />
      </Paper>
    </Panel>
  );
};

export default FlowPanel;

{
  /* <Animation
          height={"60px"}
          width={"60px"}
          name={"home"}
          onClick={() => {
            actionsNAV.openAllCoursePage();
          }}
        /> */
}

{
  /* <Animation
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
        /> */
}
