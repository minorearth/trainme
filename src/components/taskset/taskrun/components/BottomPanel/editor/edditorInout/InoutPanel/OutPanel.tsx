"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import Box from "@mui/material/Box";
import { MonacoStore } from "@/components/taskset/taskrun/layers/store/monaco";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";

const InOutPanel = observer(({ monacostore }: { monacostore: MonacoStore }) => {
  return (
    <Panel label={L.ru.TR.OUTPUTT_DATA} sx={{ height: "150px" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          maxHeight: "150px",
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
          {monacostore.output}
        </Typography>
      </Box>
    </Panel>
  );
});

export default InOutPanel;
