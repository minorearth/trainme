"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";

const InOutPanel = (props) => {
  const { currTask, refreshInput } = props;
  const [inValue, setInValue] = useState(currTask.input);

  const handleChange = (e) => {
    currTask.input = e.target.value;
    setInValue(e.target.value);
  };

  useEffect(() => {
    setInValue(currTask.input);
  }, [currTask]);

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, sm: 3 }}
      sx={{ marginTop: "10px", flexGrow: 1 }}
    >
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Входные данные"}>
          {/* <Typography
            variant="body1"
            gutterBottom
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
            }}
          >
            {currTask.input}
          </Typography> */}
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => {
              refreshInput();
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
            rows={4}
            fullWidth
            disableUnderline
            onChange={(e) => handleChange(e)}
            // variant="standard"
            value={inValue}
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              height: "100%",
            }}
          />
        </Panel>
      </Grid>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выходные данные"}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
            }}
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
            sx={{ display: "inline-block", whiteSpace: "pre-wrap" }}
          >
            {currTask.expectedOutput}
          </Typography>
        </Panel>
      </Grid>
    </Grid>
  );
};

export default InOutPanel;
