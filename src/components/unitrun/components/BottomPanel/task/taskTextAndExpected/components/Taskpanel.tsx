"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import styled from "styled-components";
import unit from "@/components/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";
import Box from "@mui/material/Box";
import ExpectedOutPanel from "./ExpectedOutPanel";
import { Task } from "@/tpconst/src";
import { renderFormulas } from "@/components/unitrun/layers/services/markdownUtils";
import "katex/dist/katex.min.css";

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
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        flexGrow: 1,
      }}
    >
      <Panel label={L.ru.TR.TASK}>
        <Wrapper>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: `<p>${renderFormulas((unit.currUnit as Task).tasktext)}</p>`,
            }}
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          ></Typography>
        </Wrapper>
      </Panel>
    </Box>
  );
});

export default TaskPanel;
