"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";
import MonacoEd from "./monaco/MonacoEd";
import Navigation from "@/components/test/testrun/components/navigation";

const TaskAndCodePanel = (props) => {
  const {
    tests,
    actions,
    appState,
    pyodide,
    currTask,
    monacoRef,
    editorRef,
    setCode,
    setRightCode,
    setForbiddenCode,
    mode,
    checkTask,
    runPythonCode,
    nextTaskNoPts,
    prevTaskNoPts,
    errorCountDownPressed,
    refreshInput,
    setOutput,
  } = props;
  return (
    <Grid container spacing={2} columns={{ xs: 1, md: 3 }}>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выполни задание"}>
          {/* dangerouslySetInnerHTML={{ __html: "<p>Hi from inner HTML</p>" }}> */}

          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: `<p>${currTask.task}</p>` }}
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {/* {currTask.task} */}
          </Typography>
        </Panel>
      </Grid>
      <Grid size={{ xs: 1, md: 2 }}>
        <Panel label={"Редактор кода"}>
          <MonacoEd
            currTask={currTask}
            mode={mode}
            setCode={setCode}
            monacoRef={monacoRef}
            editorRef={editorRef}
          />
          <Navigation
            checkTask={checkTask}
            tests={tests}
            actions={actions}
            appState={appState}
            pyodide={pyodide}
            errorCountDownPressed={errorCountDownPressed}
            currTask={currTask}
            runPythonCode={runPythonCode}
            nextTaskNoPts={nextTaskNoPts}
            prevTaskNoPts={prevTaskNoPts}
            refreshInput={refreshInput}
            setRightCode={setRightCode}
            setForbiddenCode={setForbiddenCode}
            setOutput={setOutput}
          />
        </Panel>
      </Grid>
    </Grid>
  );
};

export default TaskAndCodePanel;
