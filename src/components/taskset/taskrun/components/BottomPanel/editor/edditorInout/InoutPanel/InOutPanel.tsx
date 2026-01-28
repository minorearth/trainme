"use client";
import Grid from "@mui/material/Grid2";
import { observer } from "mobx-react-lite";
import InPanel from "./InPanel";
import OutPanel from "./OutPanel";
import { MonacoStore } from "@/components/taskset/taskrun/layers/store/monaco";

const InOutPanel = observer(
  ({ inv, monacostore }: { inv: string[]; monacostore: MonacoStore }) => {
    return (
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 2 }}
        sx={{ width: "100%", height: "150px" }}
      >
        <Grid size={{ xs: 1, md: 1 }}>
          <InPanel inv={inv} monacostore={monacostore} />
        </Grid>
        <Grid size={{ xs: 1, md: 1 }}>
          <OutPanel monacostore={monacostore} />
        </Grid>
        {/* {task.currTask.tasktype != TT.guide && (
        <Grid size={{ xs: 1, md: 1 }}>
          <ExpectedOutPanel />
        </Grid>
      )} */}
      </Grid>
    );
  },
);

export default InOutPanel;
