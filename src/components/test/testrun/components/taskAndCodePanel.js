"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/panel";
import MonacoEd from "./monaco/MonacoEd";
import Navigation from "@/components/test/testrun/components/navigation";
import styled from "styled-components";

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

    /* Position the tooltip */
    position: absolute;
    top: 20px;

    z-index: 1;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
`;

const TaskAndCodePanel = (props) => {
  const {
    tests,
    actionsNAV,
    actionsTsk,
    appState,
    pyodide,
    currTask,
    monacoRef,
    editorRef,
    checkTask,
    runPythonCode,
    monacoInfo,
  } = props;
  const { handleChangeContent } = actionsTsk;
  return (
    <Grid container spacing={2} columns={{ xs: 1, md: 3 }}>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выполни задание"}>
          <Wrapper>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: `<p>${currTask.task}</p>` }}
              sx={{ display: "inline-block", whiteSpace: "pre-line" }}
            >
              {/* {currTask.task} */}
            </Typography>
          </Wrapper>
        </Panel>
      </Grid>
      <Grid size={{ xs: 1, md: 2 }}>
        <Panel label={"Редактор кода"}>
          <MonacoEd
            currTask={currTask}
            monacoRef={monacoRef}
            editorRef={editorRef}
            handleChangeContent={handleChangeContent}
            monacoInfo={monacoInfo}
          />
          <Navigation
            checkTask={checkTask}
            tests={tests}
            actionsNAV={actionsNAV}
            actionsTsk={actionsTsk}
            appState={appState}
            pyodide={pyodide}
            currTask={currTask}
            runPythonCode={runPythonCode}
          />
        </Panel>
      </Grid>
    </Grid>
  );
};

export default TaskAndCodePanel;
