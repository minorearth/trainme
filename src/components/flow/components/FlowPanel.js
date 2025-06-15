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
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import { Tooltip } from "@mui/material";
import { observer } from "mobx-react-lite";
import navigator from "@/components/Navigator/store/navigator";
import user from "@/store/user";
import chapter from "@/components/chapter/store/chapter";

const ICON_SIZE = "60px";
const FlowPanel = observer(() => {
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
                navigator.navMethods.openAllCoursePage();
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
          <Typography variant="h4">{user.progress.rating}</Typography>
        </Box>

        <IconButtonNoRipple>
          <Tooltip title={"Учебник"}>
            <ImportContactsOutlinedIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={async () => {
                navigator.navMethods.openLessonStartPage({
                  nodemode: "textbook",
                  courseid: chapter.state.courseid,
                });
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>

        <IconButtonNoRipple>
          <Tooltip title={"Как проходить курс"}>
            <LightbulbIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={() => {
                navigator.navMethods.openTutorial();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>
        <DLSwitch />
      </Paper>
    </Panel>
  );
});

export default FlowPanel;
