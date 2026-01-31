"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import unit from "@/components/unitset/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";

const ExpectedOutPanel = observer(() => {
  return (
    <Panel label={L.ru.TR.EXPECTED_OUTPUT} sx={{ height: "150px" }}>
      <Typography
        variant="body1"
        sx={{ display: "inline-block", whiteSpace: "pre-wrap" }}
      >
        {unit.currUnit.defaultoutput.join("\n")}
      </Typography>
    </Panel>
  );
});

export default ExpectedOutPanel;
