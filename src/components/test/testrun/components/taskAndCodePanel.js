"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";
import MonacoEd from "./monaco/MonacoEd";
import Navigation from "@/components/test/testrun/components/navigation";

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
  } = props;
  const { setCode } = actionsTsk;
  return (
    <Grid container spacing={2} columns={{ xs: 1, md: 3 }}>
      <Grid size={{ xs: 1, md: 1 }}>
        <Panel label={"Выполни задание"}>
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
            setCode={setCode}
            monacoRef={monacoRef}
            editorRef={editorRef}
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
