"use client";
import Grid from "@mui/material/Grid2";
import { observer } from "mobx-react-lite";
import InPanel from "./InPanel";
import OutPanel from "./OutPanel";

const InOutPanel = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: 2 }}
      sx={{ width: "100%", height: "150px" }}
    >
      <Grid size={{ xs: 1, md: 1 }}>
        <InPanel monacoid={monacoid} />
      </Grid>
      <Grid size={{ xs: 1, md: 1 }}>
        <OutPanel monacoid={monacoid} />
      </Grid>
    </Grid>
  );
});

export default InOutPanel;
