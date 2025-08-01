"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/panel";
import MonacoEd from "./monaco/MonacoEd";
import CodeRunPanel from "@/components/taskset/taskrun/components/coderunPanel";
import styled from "styled-components";
import task from "@/components/taskset/taskrun/layers/store/task";
import { observer } from "mobx-react-lite";
import { TT } from "tpconst/const";
import { L } from "tpconst/lang";

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

const TaskAndCodePanel = observer(() => {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: task.currTask?.tasktype == TT.guide ? 1 : 3 }}
    >
      {task.currTask.tasktype != TT.guide && (
        <Grid size={{ xs: 1, md: 1 }}>
          <Panel label={L.ru.TR.TASK}>
            <Wrapper>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: `<p>${task.currTask.tasktext}</p>`,
                }}
                sx={{ display: "inline-block", whiteSpace: "pre-line" }}
              />
            </Wrapper>
          </Panel>
        </Grid>
      )}
      <Grid size={{ xs: 1, md: 2 }}>
        <Panel label={L.ru.TR.EDITOR}>
          <MonacoEd />
          <CodeRunPanel />
        </Panel>
      </Grid>
    </Grid>
  );
});

export default TaskAndCodePanel;
