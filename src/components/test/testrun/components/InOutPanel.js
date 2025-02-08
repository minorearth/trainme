"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";

const InOutPanel = ({ currTask }) => {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: 3 }}
      sx={{ marginTop: "10px", flexGrow: 1 }}
    >
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Входные данные"}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {currTask.input}
          </Typography>
        </Panel>
      </Grid>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выходные данные"}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {currTask.output}
          </Typography>
        </Panel>
      </Grid>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Ожидаемый результат"}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {currTask.expectedOutput}
          </Typography>
        </Panel>
      </Grid>
    </Grid>
  );
};

export default InOutPanel;
