// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React from "react";
import { Panel } from "@xyflow/react";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import { observer } from "mobx-react-lite";
import L from "@/globals/local";

//css
import "@xyflow/react/dist/base.css";

//icons
import { BiCoinStack } from "react-icons/bi";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";

//components
import DLSwitch from "@/components/common/themeswitch/themeSwitch";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import user from "@/auth/store/user";
import course from "@/components/course/layers/store/course";
import {
  CHAMP_DEFAULTS,
  CHAMPUSER_DEFAULTS,
  CHAPTER_DEFAULTS,
  TASKSET_DEFAULTS,
} from "@/T/typesdefaults";
import { TSM } from "@/T/const";

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
          <Tooltip title={L.ru.TT.GOMAINPAGE}>
            <HomeIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={() => {
                navigator.actions.openAllCoursePage();
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
          <Tooltip title={L.ru.TT.TEXTBOOK}>
            <ImportContactsOutlinedIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={async () => {
                navigator.actions.openLessonStartPage({
                  tasksetData: {
                    ...TASKSET_DEFAULTS,
                    tasksetmode: TSM.textbook,
                  },
                  chapterData: CHAPTER_DEFAULTS,
                  champData: CHAMP_DEFAULTS,
                  courseData: { courseid: course.state.courseid },
                });
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>

        <IconButtonNoRipple>
          <Tooltip title={L.ru.TT.HOWTO_GUIDE}>
            <LightbulbIcon
              sx={{ fontSize: ICON_SIZE }}
              onClick={() => {
                navigator.actions.openTutorial();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>
        <DLSwitch sx={{}} />
      </Paper>
    </Panel>
  );
});

export default FlowPanel;
