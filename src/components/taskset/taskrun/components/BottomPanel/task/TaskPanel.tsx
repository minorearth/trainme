"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import styled from "styled-components";
import task from "@/components/taskset/taskrun/layers/store/task";

import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import countdownbutton from "@/components/common/CountdownButton/store";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ExpectedOutPanel from "./ExpectedOutPanel";
import { useEffect, useState } from "react";
import { monacostore } from "../../../layers/store/monaco";
import { Task } from "@/tpconst/src";

const Wrapper = styled.div`
  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    /* width: 500px; */
    left: 5px;
    white-space: nowrap;
    max-width: 500px;
    background-color: white;
    color: black;
    text-align: center;
    border-radius: 3px;
    border-color: black;
    border-style: solid;
    padding: 5px;
    position: absolute;
    top: 20px;

    z-index: 1;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
`;

const TaskPanel = observer(() => {
  const [monacoStore] = useState(() => new monacostore());
  useEffect(() => {
    task.setMonacoStore(monacoStore);
  }, [monacoStore]);

  return (
    <Panel label={L.ru.TR.TASK} sx={{ height: "100%" }}>
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Wrapper>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: `<p>${(task.currTask as Task).tasktext}</p>`,
            }}
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          ></Typography>
        </Wrapper>

        {!countdownbutton.state.visible &&
          task.currTask.tasktype == TT.task && (
            <Box
              sx={{
                flexDirection: "row",
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                marginBottom: "10px",
                marginTop: "15px",
              }}
            >
              <Button
                onClick={(e) => {
                  task.actions.preCheckTaskAction();
                }}
                disabled={task.monaco?.executing}
                variant="outlined"
              >
                {L.ru.buttons.PRE_CHECK_TASK}
              </Button>
            </Box>
          )}
        <ExpectedOutPanel />
      </Box>
    </Panel>
  );
});

export default TaskPanel;
