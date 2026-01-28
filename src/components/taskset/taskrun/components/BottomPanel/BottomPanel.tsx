"use client";
import Grid from "@mui/material/Grid2";
import task from "@/components/taskset/taskrun/layers/store/task";

import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import TaskPanel from "./task/TaskPanel";
import GuideForm from "./guide/guide";
import { Watcher } from "./editor/monaco/watcher/watcher";
import TaskCode from "./taskCode/taskCode";

const BottomPanel = observer(() => {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: task.currTask?.tasktype == TT.guide ? 1 : 3 }}
      sx={{ height: "100%" }}
    >
      {task.currTask.tasktype != TT.guide && (
        <Grid size={{ xs: 1, md: 1 }}>
          <TaskPanel />
        </Grid>
      )}
      <Watcher />

      <Grid size={{ xs: 1, md: 2 }}>
        {task.currTask.tasktype == "task" && <TaskCode />}
        {task.currTask.tasktype != "task" && <GuideForm />}
      </Grid>
    </Grid>
  );
});

export default BottomPanel;
