"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import Box from "@mui/material/Box";
import unit from "@/components/unitset/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";

const OutPanel = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Panel label={L.ru.TR.OUTPUTT_DATA} sx={{ height: "170px" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            display: "inline-block",
            whiteSpace: "pre-wrap",
          }}
        >
          {unit.editors[monacoid].output}
        </Typography>
      </Box>
    </Panel>
  );
});

export default OutPanel;
