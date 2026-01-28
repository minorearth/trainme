"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import { MonacoStore } from "@/components/taskset/taskrun/layers/store/monaco";

import { L } from "@/tpconst/src/lang";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import { Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

//TODO: add task version(must)
const CodeRunPanel = observer(
  ({ monacostore }: { monacostore: MonacoStore }) => {
    return (
      <Box
        sx={{
          width: "100%",
          // marginTop: "15px",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          height: "30px",
        }}
      >
        {!countdownbutton.state.visible && (
          <IconButtonNoRipple disabled={monacostore.executing}>
            <Tooltip title={L.ru.TT.CODE_RUN}>
              <PlayCircleOutlineIcon
                sx={{
                  fontSize: "40px",
                  // marginLeft: "25px",
                  marginRight: "15px",
                }}
                onClick={() => monacostore.runTask()}
              />
            </Tooltip>
          </IconButtonNoRipple>

          // <Button
          //   onClick={() => monacostore.runTask()}
          //   variant="outlined"
          //   disabled={monacostore.executing}
          // >
          //   {monacostore.executing
          //     ? L.ru.buttons.TASK_EXECUTING
          //     : L.ru.buttons.RUNTASSK}
          // </Button>
        )}
      </Box>
    );
  },
);

export default CodeRunPanel;
