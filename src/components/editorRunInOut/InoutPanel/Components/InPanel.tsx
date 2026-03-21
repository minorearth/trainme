"use client";
import { Panel } from "@/components/common/panel";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import unit from "@/components/unitrun/layers/store/unit";
import Box from "@mui/material/Box";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";
import CustomInput from "@/components/common/customInput/customInput";
import { CODERUN_IN_OUT_HT } from "@/components/unitrun/uiconfig";

const InPanel = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Panel label={L.ru.TR.INPUT_DATA}>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => {
            unit.refreshInput(monacoid);
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

        <CustomInput
          value={unit.editors[monacoid].input}
          onchange={(e) => (unit.editors[monacoid].input = e.target.value)}
        />
      </Box>
    </Panel>
  );
});

export default InPanel;
