"use client";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import pyodide from "@/components/pyodide/pyodide";

import { L } from "@/tpconst/src/lang";
import IconButtonNoRipple from "@/components/common/IconButtonNoRipple/IconButtonNoRipple";
import { Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { FaMagic } from "react-icons/fa";

import { TT } from "@/tpconst/src";
import { magicCode } from "@/components/unitset/unitrun/layers/services/taskCheckHelpers";
import {
  ensureWorker,
  terminateWorker,
} from "@/components/pyodide/newWorkerAPI";
import { preCheckTaskAction } from "@/components/unitset/unitrun/layers/services/taskCheck";
import { toJS } from "mobx";
//TODO: add task version(must)
const CodeRunPanel = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Box
      sx={{
        width: "100%",
        // marginTop: "15px",
        marginBottom: "5px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        height: "50px",
      }}
    >
      {!countdownbutton.state.visible && (
        //TODO:
        // <IconButtonNoRipple disabled={task.monacostore.executing}>
        <IconButtonNoRipple
          disabled={
            unit.editors[monacoid].codepart == "" ||
            pyodide.executing == true ||
            !pyodide.worker
          }
        >
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <PlayCircleOutlineIcon
              sx={{
                fontSize: "40px",
              }}
              onClick={() => unit.playCode(monacoid)}
            />
          </Tooltip>
        </IconButtonNoRipple>
      )}
      {!countdownbutton.state.visible &&
        unit.currUnit.unittype == TT.task &&
        unit.editors[monacoid].unittype != "pg" && (
          //TODO:
          // <IconButtonNoRipple disabled={task.monacostore.executing}>
          <IconButtonNoRipple
            disabled={
              unit.editors[monacoid].codepart == "" ||
              pyodide.executing == true ||
              !pyodide.worker
            }
          >
            <Tooltip title={L.ru.TT.CODE_RUN}>
              <PlaylistAddCheckCircleOutlinedIcon
                sx={{
                  fontSize: "40px",
                  // marginLeft: "25px",
                }}
                onClick={(e) => {
                  preCheckTaskAction();
                }}
              />
            </Tooltip>
          </IconButtonNoRipple>
        )}
      {!countdownbutton.state.visible && unit.currUnit.unittype == TT.task && (
        <IconButtonNoRipple
          disabled={
            unit.editors[monacoid].codepart == "" ||
            pyodide.executing == true ||
            !pyodide.worker
          }
        >
          <Tooltip title={L.ru.TT.CODE_RUN}>
            <FaMagic style={{ fontSize: "30px" }} onClick={() => magicCode()} />
          </Tooltip>
        </IconButtonNoRipple>
      )}
    </Box>
  );
});

export default CodeRunPanel;
