"use client";
import Grid from "@mui/material/Grid2";
import unit from "@/components/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import TaskPanel from "./taskText/TaskPanel";
import Guide from "./guide/guide";
import TaskCode from "./taskCode/taskCode";

const BottomPanel = observer(() => {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: unit.currUnit?.unittype == TT.guide ? 1 : 3 }}
      sx={{ height: "100%" }}
    >
      {unit.currUnit.unittype != TT.guide && (
        <Grid size={{ xs: 1, md: 1 }}>
          <TaskPanel />
        </Grid>
      )}
      {/* <Watcher /> */}

      <Grid size={{ xs: 1, md: 2 }}>
        {unit.currUnit.unittype == TT.task && <TaskCode />}
        {unit.currUnit.unittype == TT.guide && <Guide />}
      </Grid>
    </Grid>
  );
});

export default BottomPanel;
