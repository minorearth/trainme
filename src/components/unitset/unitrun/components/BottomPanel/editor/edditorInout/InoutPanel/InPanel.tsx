"use client";
import { Panel } from "@/components/common/panel";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import Box from "@mui/material/Box";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";

const InPanel = observer(({ monacoid }: { monacoid: number }) => {
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   monacostore.setInput(e.target.value);
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    unit.editors[monacoid].input = e.target.value;
  };

  return (
    <Panel label={L.ru.TR.INPUT_DATA} sx={{ height: "150px" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          maxHeight: "150px",
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

        <Input
          id="standard-multiline-flexible"
          multiline
          fullWidth
          // height="100%"
          disableUnderline
          rows={7}
          onChange={(e) => handleChange(e)}
          value={unit.editors[monacoid].input}
          sx={{
            display: "inline-block",
            whiteSpace: "pre-wrap",
          }}
        />
      </Box>
    </Panel>
  );
});

export default InPanel;
