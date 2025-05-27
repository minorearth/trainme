"use client";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LinearProgressWithLabel from "@/components/test/testrun/components/LinearProgress";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import Animation from "@/components/common/lottieAnimation/Animation";
import Typography from "@mui/material/Typography";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Grid2";
import { observer } from "mobx-react-lite";
import AS from "@/store/appstate";

const TopPanel = observer(({ tasks, monacoRef, actionsNAV }) => {
  const theme = useTheme();

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
            value={((AS.as.taskId + 1) / tasks.length) * 100}
            label={`${AS.as.taskId + 1}\\${tasks.length}`}
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
            {AS.as.pts}
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
                  actionsNAV.openTutorial();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>

          {/* <IconButtonNoRipple>
            <Tooltip title={"Задать вопрос"}>
              <SupportAgentIcon
                sx={{ fontSize: "40px", marginRight: "15px" }}
                onClick={() => {
                  actionsNAV.openSupportPage();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple> */}

          <IconButtonNoRipple>
            <Tooltip title={"Заверить прохождение"}>
              <HomeIcon
                sx={{ fontSize: "40px", marginRight: "15px" }}
                onClick={() => {
                  AS.as.nodemode != "textbook" &&
                    actionsNAV.openCongratPageInterrupted();
                  AS.as.nodemode == "textbook" &&
                    actionsNAV.openFlowPageAfterAccomplished();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>
          <DLSwitch monacoRef={monacoRef} />
        </Box>
      </Grid>
    </Grid>

    // <Box
    //   sx={{
    //     display: "flex",
    //     flexDirection: "row",
    //     alignItems: "center",
    //   }}
    // >

    // </Box>
  );
});

export default TopPanel;
