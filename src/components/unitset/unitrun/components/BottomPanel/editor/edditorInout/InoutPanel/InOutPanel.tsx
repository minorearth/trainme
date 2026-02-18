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
      sx={{
        width: "100%",
        // display: "flex",
        // flex: "1",
        height: "170px",
      }}
    >
      <Grid
        size={{ xs: 1, md: 1 }}
        sx={{
          height: "170px",
        }}
      >
        <InPanel monacoid={monacoid} />
      </Grid>

      <Grid
        size={{ xs: 1, md: 1 }}
        sx={{
          height: "170px",
        }}
      >
        <OutPanel monacoid={monacoid} />
      </Grid>
    </Grid>
  );
});

export default InOutPanel;
