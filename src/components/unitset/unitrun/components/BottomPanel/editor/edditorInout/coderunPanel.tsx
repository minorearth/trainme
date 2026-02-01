"use client";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import unit from "@/components/unitset/unitrun/layers/store/unit";

import { L } from "@/tpconst/src/lang";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import { Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import { TT } from "@/tpconst/src";
//TODO: add task version(must)
const CodeRunPanel = observer(({ monacoid }: { monacoid: number }) => {
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
        //TODO:
        // <IconButtonNoRipple disabled={task.monacostore.executing}>
        <IconButtonNoRipple disabled={false}>
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <PlayCircleOutlineIcon
              sx={{
                fontSize: "40px",
                marginRight: "1px",
              }}
              onClick={() => unit.runCode(monacoid)}
            />
          </Tooltip>
        </IconButtonNoRipple>
      )}
      {!countdownbutton.state.visible && unit.currUnit.unittype == TT.task && (
        //TODO:
        // <IconButtonNoRipple disabled={task.monacostore.executing}>
        <IconButtonNoRipple disabled={unit.editors[monacoid].code == ""}>
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <PlaylistAddCheckCircleOutlinedIcon
              sx={{
                fontSize: "40px",
                // marginLeft: "25px",
                marginRight: "15px",
              }}
              onClick={(e) => {
                unit.actions.preCheckTaskAction();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>
      )}
    </Box>
  );
});

export default CodeRunPanel;
