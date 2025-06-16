"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgressWithLabel from "@/components/chapter/taskrun/components/LinearProgress";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import Animation from "@/components/common/lottieAnimation/Animation";
import Typography from "@mui/material/Typography";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Grid2";
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import { observer } from "mobx-react-lite";
import flow from "@/components/course/store/course";

const TopPanel = observer(() => {
  return (
    <Grid
      container
      spacing={0}
      columns={{ xs: 1, sm: 6, md: 10 }}
      sx={{ marginTop: "10px", flexGrow: 1 }}
    >
      <Grid size={{ xs: 1, sm: 3, md: 7 }} order={{ xs: 2, sm: 1, md: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animation height={"80px"} width={"80px"} name={"sheep"} />
          <LinearProgressWithLabel
            value={((task.currTaskId + 1) / chapter.tasknum) * 100}
            label={`${task.currTaskId + 1}\\${chapter.tasknum}`}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 1, sm: 3, md: 3 }} order={{ xs: 1, sm: 2, md: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animation height={"50px"} width={"50px"} name={"coins"} />
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: 22 }}
          >
            {chapter.state.pts}
          </Typography>

          <IconButtonNoRipple>
            <Tooltip title={"Как проходить курс"}>
              <LightbulbIcon
                sx={{
                  fontSize: "40px",
                  marginLeft: "25px",
                  marginRight: "15px",
                }}
                onClick={() => {
                  navigator.navMethods.openTutorial();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>

          <IconButtonNoRipple>
            <Tooltip title={"Заверить прохождение"}>
              <HomeIcon
                sx={{ fontSize: "40px", marginRight: "15px" }}
                onClick={() => {
                  chapter.state.nodemode != "textbook" &&
                    navigator.navMethods.openCongratPageInterrupted();
                  chapter.state.nodemode == "textbook" &&
                    navigator.navMethods.openAndRefreshFlowPage(
                      flow.state.courseid
                    );
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>
          <DLSwitch />
        </Box>
      </Grid>
    </Grid>
  );
});

export default TopPanel;
