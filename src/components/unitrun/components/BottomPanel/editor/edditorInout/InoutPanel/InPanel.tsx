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

const InPanel = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Panel label={L.ru.TR.INPUT_DATA} sx={{ height: "100%" }}>
      <></>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          // maxHeight: "150px",
          overflowY: "auto",
          overflowX: "auto",
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

        <CustomInput monacoid={monacoid} />
      </Box>
    </Panel>
  );
});

export default InPanel;
