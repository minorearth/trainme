"use client";
import Grid from "@mui/material/Grid2";
import { observer } from "mobx-react-lite";
import InPanel from "./InPanel";
import OutPanel from "./OutPanel";
import { useMediaQuery } from "@uidotdev/usehooks";

const InOutPanel = observer(({ monacoid }: { monacoid: number }) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // например, для мобильных

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: 2 }}
      sx={{
        width: "100%",
        // display: "flex",
        // flex: "1",
        height: isMobile ? "340px" : "170px",
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
