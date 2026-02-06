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
import { FaMagic } from "react-icons/fa";

import { TT } from "@/tpconst/src";
import { magicCode } from "@/components/unitset/unitrun/layers/services/taskCheckHelpers";
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
        <IconButtonNoRipple disabled={unit.editors[monacoid].codepart == ""}>
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <PlayCircleOutlineIcon
              sx={{
                fontSize: "40px",
              }}
              onClick={() => unit.runCode(monacoid)}
            />
          </Tooltip>
        </IconButtonNoRipple>
      )}
      {!countdownbutton.state.visible && unit.currUnit.unittype == TT.task && (
        //TODO:
        // <IconButtonNoRipple disabled={task.monacostore.executing}>
        <IconButtonNoRipple disabled={unit.editors[monacoid].codepart == ""}>
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <PlaylistAddCheckCircleOutlinedIcon
              sx={{
                fontSize: "40px",
                // marginLeft: "25px",
              }}
              onClick={(e) => {
                unit.actions.preCheckTaskAction();
              }}
            />
          </Tooltip>
        </IconButtonNoRipple>
      )}
      {!countdownbutton.state.visible && unit.currUnit.unittype == TT.task && (
        <IconButtonNoRipple disabled={unit.editors[monacoid].codepart == ""}>
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <FaMagic
              style={{ fontSize: "30px" }}
              // sx={{
              //   fontSize: "40px",
              //   // marginLeft: "25px",
              //   marginRight: "15px",
              // }}
              onClick={() => magicCode()}
            />
          </Tooltip>
        </IconButtonNoRipple>
      )}
    </Box>
  );
});

export default CodeRunPanel;
