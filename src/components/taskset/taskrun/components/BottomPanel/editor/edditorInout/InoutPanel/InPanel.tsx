"use client";
import { Panel } from "@/components/common/panel";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import { MonacoStore } from "@/components/taskset/taskrun/layers/store/monaco";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";

const InPanel = observer(
  ({ inv, monacostore }: { inv: string[]; monacostore: MonacoStore }) => {
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      monacostore.setInput(e.target.value);
    };

    return (
      <Panel label={L.ru.TR.INPUT_DATA} sx={{ height: "150px" }}>
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => {
            monacostore.refreshInput(inv);
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
          value={monacostore.input}
          sx={{
            display: "inline-block",
            whiteSpace: "pre-wrap",
          }}
        />
      </Panel>
    );
  },
);

export default InPanel;
