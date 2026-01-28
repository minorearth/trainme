"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import task from "@/components/taskset/taskrun/layers/store/task";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";

const ExpectedOutPanel = observer(() => {
  return (
    <Panel label={L.ru.TR.EXPECTED_OUTPUT} sx={{ height: "150px" }}>
      <Typography
        variant="body1"
        sx={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {task.currTask.defaultoutput.join("\n")}
      </Typography>
    </Panel>
  );
});

export default ExpectedOutPanel;
