"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/panel";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import task from "@/components/taskset/taskrun/layers/store/task";
import { observer } from "mobx-react-lite";

const InOutPanel = observer(() => {
  const handleChange = (e) => {
    task.updateCurrTask({ input: e.target.value });
  };

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: task.currTask.tasktype == "guide" ? 2 : 3 }}
      sx={{ marginTop: "10px", flexGrow: 1 }}
    >
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Входные данные"}>
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => {
              task.refreshInput();
            }}
            sx={{
              position: "absolute",
              right: "10px",
              top: "-5px",
              zIndex: 100,
            }}
            edge="end"
            size="small"
          >
            <CachedIcon />
          </IconButton>

          <Input
            id="standard-multiline-flexible"
            multiline
            fullWidth
            height="100%"
            disableUnderline
            rows={7}
            onChange={(e) => handleChange(e)}
            value={task.currTask.input}
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
            }}
          />
        </Panel>
      </Grid>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выходные данные"}>
          <Box
            sx={{
              height: "100%",
              maxHeight: "200px",
              overflow: "hidden",
              overflowY: "auto",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                display: "inline-block",
                whiteSpace: "pre-wrap",
              }}
            >
              {task.currTask.output}
            </Typography>
          </Box>
        </Panel>
      </Grid>
      {task.currTask.tasktype != "guide" && (
        <Grid size={{ xs: 1, md: 1 }}>
          <Panel label={"Ожидаемый результат"}>
            <Typography
              variant="body1"
              sx={{ display: "inline-block", whiteSpace: "pre-wrap" }}
            >
              {task.currTask.expectedOutput}
            </Typography>
          </Panel>
        </Grid>
      )}
    </Grid>
  );
});

export default InOutPanel;
