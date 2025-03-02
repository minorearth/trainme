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
    nav,
    pyodide,
    currTask,
    monacoRef,
    editorRef,
    setCode,
    mode,
    checkTask,
    runPythonCode,
    nextTaskNoPts,
    prevTaskNoPts,
    ErrorCountDownPressed,
    refreshInput,
  } = props;
  return (
    <Grid container spacing={2} columns={{ xs: 1, md: 3 }}>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выполни задание"}>
          <Typography
            variant="body1"
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {currTask.task}
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
            nav={nav}
            pyodide={pyodide}
            ErrorCountDownPressed={ErrorCountDownPressed}
            currTask={currTask}
            runPythonCode={runPythonCode}
            nextTaskNoPts={nextTaskNoPts}
            prevTaskNoPts={prevTaskNoPts}
            refreshInput={refreshInput}
          />
        </Panel>
      </Grid>
    </Grid>
  );
};

export default TaskAndCodePanel;
